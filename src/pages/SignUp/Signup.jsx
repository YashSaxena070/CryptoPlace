import React, { useState } from 'react';
import './signup.css'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call (replace with real backend integration)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSubmitting(false);
    // Reset form on success (optional)
    // setFormData({ username: '', email: '', password: '' });
  };
 
  

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(#0b004e, #1d152f, #002834)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <button className="back-button1" onClick={() => navigate("/")}>
        Back to Market
      </button>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '1.5rem' }}>
          Create Your Account
        </h2>
        
        {success && (
          <div style={{
            color: '#28a745',
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#d4edda',
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>
            Account created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.username ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              required
            />
            {errors.username && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.username}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              required
            />
            {errors.email && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              minLength={6}
              required
            />
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {success && (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
            {/* In a real app, add a redirect: useNavigate from react-router-dom */}
            <p>You can now log in to your account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
