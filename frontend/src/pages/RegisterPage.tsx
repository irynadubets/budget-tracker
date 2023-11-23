import React, { FormEvent, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const RegisterPage: React.FC = () => {
  const { registerUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const userData = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const errorMessage = await registerUser(userData);
      setRegisterError(errorMessage);
    } catch (error) {
      setRegisterError('Something went wrong during registration. Please try again.');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', minWidth: '300px', margin: 'auto' }}>
        <TextField
          type="text"
          name="username"
          label="Username"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          type="email"
          name="email"
          label="Email"
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
          Register
        </Button>
        {registerError && (
          <Alert severity="error" style={{ marginTop: '16px', marginBottom: '16px', maxWidth: '300px' }}>
            <AlertTitle>Register Error</AlertTitle>
            {registerError.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        )}
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ cursor: 'pointer', color: 'blue' }}>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
