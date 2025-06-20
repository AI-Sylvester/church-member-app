import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config'; // <-- Import API base
const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // for registration
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      try {
          const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } catch {
        setError('Invalid credentials');
      }
    } else if (mode === 'register') {
      if (!email) {
        setError('Email is required');
        return;
      }
      try {
        await axios.post('http://localhost:5000/api/auth/register', { username, password, email });
        setSuccess('User created successfully! Please login.');
        setUsername('');
        setPassword('');
        setEmail('');
        setMode('login');
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Registration failed');
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        {mode === 'register' && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <button type="submit">{mode === 'login' ? 'Login' : 'Create User'}</button>
      </form>
      <button
        onClick={() => {
          setError('');
          setSuccess('');
          setMode(mode === 'login' ? 'register' : 'login');
        }}
        style={{ marginTop: 10 }}
      >
        {mode === 'login' ? 'Create new account' : 'Back to login'}
      </button>
    </div>
  );
};

export default Login;
