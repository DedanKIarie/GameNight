import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  };

  const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const signupButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#008CBA',
    color: 'white',
  };

  const messageStyle = {
    color: 'red',
    marginTop: '15px',
    fontSize: '14px',
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!loginUsername || !loginPassword) {
      setMessage("Please enter both username and password for login.");
      return;
    }

    try {
      const res = await fetch("https://gamenight-backend-a56o.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      if (res.ok) {
        const player = await res.json();
        onLogin(player);
        setMessage("Login successful!");
        setLoginUsername('');
        setLoginPassword('');
        navigate('/');
      } else {
        const err = await res.json();
        setMessage(err.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Network error or server unavailable.");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!signupUsername || !signupPassword) {
      setMessage("Please enter both username and password for signup.");
      return;
    }
    if (signupUsername.length < 3) {
      setMessage("Username must be at least 3 characters.");
      return;
    }

    try {
      const res = await fetch("https://gamenight-backend-a56o.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });

      if (res.ok) {
        const player = await res.json();
        onLogin(player);
        setMessage("Sign up successful! You are now logged in.");
        setSignupUsername('');
        setSignupPassword('');
        navigate('/');
      } else {
        const err = await res.json();
        setMessage(err.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Network error or server unavailable.");
    }
  };

  return (
    <div style={formContainerStyle}>
      <div style={sectionStyle}>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={loginButtonStyle}>Login</button>
        </form>
      </div>

      <div style={sectionStyle}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignupSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={signupButtonStyle}>Sign Up</button>
        </form>
      </div>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default Login;
