import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
        setShowButtons(true);
        setTimeout(() => setShowButtons(false), 60000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    } else {
      if (!email) {
        setError('Email is required');
        return;
      }
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, { username, password, email });
        setSuccess('User created successfully! Please login.');
        setUsername('');
        setPassword('');
        setEmail('');
        setMode('login');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#FAFAFA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 20px rgba(44, 62, 80, 0.12)',
          width: { xs: '90%', sm: 360 },
          textAlign: 'center',
          border: '1.5px solid #B89B47',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 1,
            fontWeight: 700,
            color: '#2C3E50',
            letterSpacing: 1.5,
          }}
        >
          Church Door
        </Typography>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: '#8B1A1A',
          }}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, fontWeight: 600 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, fontWeight: 600 }}>{success}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: '#B89B47',
                  boxShadow: '0 0 6px #B89B47',
                },
              },
            }}
          />

          {mode === 'register' && (
            <TextField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: '#B89B47',
                    boxShadow: '0 0 6px #B89B47',
                  },
                },
              }}
            />
          )}

          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: '#B89B47',
                  boxShadow: '0 0 6px #B89B47',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#8B1A1A',
              color: '#FFFFFF',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#6a1414',
              },
              width: '100%',
              mb: 2,
            }}
          >
            {mode === 'login' ? 'Login' : 'Create User'}
          </Button>
        </Box>

        {showButtons && (
          <>
            <Button
              onClick={() => {
                setError('');
                setSuccess('');
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              variant="outlined"
              sx={{
                borderColor: '#B89B47',
                color: '#2C3E50',
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                width: '100%',
                mb: 2,
                '&:hover': {
                  borderColor: '#8B1A1A',
                  color: '#8B1A1A',
                  bgcolor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              {mode === 'login' ? 'Create new account' : 'Back to login'}
            </Button>

            <Button
              onClick={() => setShowButtons(false)}
              variant="outlined"
              sx={{
                borderColor: '#8B1A1A',
                color: '#8B1A1A',
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                width: '100%',
                '&:hover': {
                  bgcolor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              Hide
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Login;
