import React, { useEffect, useRef, useState } from 'react'
import './Chatbot.css'
import { useSelector } from 'react-redux'

const Chatbot = () => {
  const { user } = useSelector((state) => state.user);
  const userName = user?.displayName || user?.email?.split('@')[0] || 'there';
  const [messages, setMessages] = useState([{ text: `Hello ${userName}! How can I help you with crypto today?`, sender: "ai" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Only scroll the chatbot container, not the whole page
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest('.chatbot-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  // Update greeting when user logs in
  useEffect(() => {
    if (user && messages.length === 1) {
      setMessages([{ text: `Hello ${userName}! How can I help you with crypto today?`, sender: "ai" }]);
    }
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = "You are a helpful assistant specializing in cryptocurrency. Your name is CryptoAssistant. Answer the user's questions about blockchain, specific coins, and market trends. If a question is not related to crypto, politely decline to answer and guide them back to cryptocurrency topics.";
      const apiKey = import.meta.env.VITE_GEMINI_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: input }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }
      let response;
      let retries = 0;
      const maxRetries = 3;
      while (retries < maxRetries) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          break;
        }
        if (response.status === 429) { // Throttling
          retries++;
          const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw new Error(`API call failed with status: ${response.status}`);
        }
      }

      if (!response.ok) {
        throw new Error(`API call failed after ${maxRetries} retries.`);
      }
      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { text: aiText, sender: "ai" }]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages(prev => [...prev, { text: "Sorry, something went wrong. Please try again.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };
  // Format AI messages to handle line breaks and markdown
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Crypto Assistant</h3>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
            <div className="chatbot-message-content">{formatMessage(msg.text)}</div>
          </div>
        ))}
        {isLoading && <div className="chatbot-message ai-message">
          <div className="chatbot-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="chatbot-form">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask about crypto..." 
          className="chatbot-input"
          disabled={isLoading}
        />
        <button type="submit" className="chatbot-button" disabled={isLoading}>&rarr;</button>
      </form>
    </div>
  )
}

export default Chatbot