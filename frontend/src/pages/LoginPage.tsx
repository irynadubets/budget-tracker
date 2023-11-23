import React, { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const LoginPage: React.FC = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleRegisterLink = () => {
    navigate('/register');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(e);
      setLoginError(null);
    } catch (error) {
      setLoginError('Invalid credentials. Please check your username and password.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minWidth: '300px', margin: 'auto' }}>
        <TextField
          type="text"
          name="username"
          label="Username"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          variant="outlined"
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Login
        </Button>
        {loginError && (
          <Alert severity="error" style={{ marginTop: '16px', marginBottom: '16px', maxWidth: '300px' }}>
            <AlertTitle>Login Error</AlertTitle>
            {loginError}
          </Alert>
        )}
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Don't have an account?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleRegisterLink}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
