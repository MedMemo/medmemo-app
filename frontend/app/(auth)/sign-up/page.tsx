'use client';

import React, { useState } from 'react';

const SignUp = () => {
  // useStates for updating and setting components
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState('');

  //function to handle sign-up form-submission 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //to not interrupt request

    try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST', //send user data to backend server
      headers: { 'Content-Type': 'application/json' },//parse POST data
      body: JSON.stringify({ email, password, username }),//convert to JSON for reading
    });

    //stores user info in variable data
    const data = await response.json(); 

    //display success, reset form info
    setSuccess('Sign Up Success');
    console.log('Response:', data); 
    setEmail('');
    setPassword('');
    setUsername('');
  } catch (err) {
    console.error('Sign-Up Failed:', err);
  }
};

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      backgroundColor: '#ffffff', 
      color: '#000000', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Sign Up
      </h1>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          width: '300px', 
          margin: '0 auto' 
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="email" 
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #000000', 
              borderRadius: '4px' 
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="password" 
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #000000', 
              borderRadius: '4px' 
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="username" 
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #000000', 
              borderRadius: '4px' 
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#333333', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Sign Up
        </button>
      </form>
      {success && (
        <p style={{ marginTop: '15px', color: 'green' }}>
          {success}
        </p>
      )}
    </div>
  );
};

export default SignUp;