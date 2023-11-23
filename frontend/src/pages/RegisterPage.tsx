import React, { FormEvent, useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterPage: React.FC = () => {
  const { registerUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const userData = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
    };

    registerUser(userData);
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
      </form>
    </div>
  );
};

export default RegisterPage;
