import React, { useState, useRef } from 'react';
import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { checkValidData } from '../../features/validate';
import { auth } from '../../firebase';
import { login } from '../../features/userSlice';
const Signup = () => {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleSignin = () => {
    setIsSignIn(!isSignIn);
  };
  
  const navigate = useNavigate();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const confirmPassword = useRef(null);

  const handleButtonClick = (e) => {
      const message = checkValidData(email.current.value, password.current.value);
      setErrorMessage(message);

      if (message) return;

      //signin/ sign up logic
      if(!isSignIn){
          //signup logic
          if(confirmPassword.current.value!=password.current.value){
            setErrorMessage("Password mismatch, Try again!")
            return
          }

          createUserWithEmailAndPassword(
            auth,
            email.current.value,
            password.current.value
          )
          .then((userCredential) =>{
            //signed up
            updateProfile(auth.currentUser, {
              displayName: name.current.value,

            })
              .then(() => {
                const {uid, email, displayName} = auth.currentUser;
                dispatch(login({ uid, email, displayName }));
                setSuccess(true);
                navigate('/');
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          })
          .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessage(errorCode+ "-" +errorMessage);
          });
      }else{
        //signin
        signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        )
         .then((userCredential) =>{
          //signed in
          const {uid, email, displayName} = userCredential.user;
          dispatch(login({ uid, email, displayName }));
          navigate('/');
         })
         .catch((error)=>{
          setErrorMessage("User not found");
         })
      }
  }

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
          {isSignIn? 'Sign In' : 'Create your Account'}
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

        <form onSubmit={(e) =>{
          e.preventDefault();
        }}>
          <h1 className="font-bold py-4 text-3xl text-white">
          {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          {!isSignIn && (
            <input 
            ref={name}
            placeholder='Full Name'
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem'
            }}
            type="text" />
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={email}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={password}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              minLength={6}
              required
            />
            {!isSignIn && (
             <input
            ref={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem'
            }}
            className="bg-gray-400/70 p-3 my-2 rounded w-full focus:bg-white"
            />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleButtonClick}
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
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
          {errorMessage && (
            <div style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.75rem', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button type="button" onClick={toggleSignin} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
              {isSignIn ? 'New to CryptoPlace? Create an account' : 'Already have an account? Sign in'}
            </button>
          </div>
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
