import React, { FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const {loginUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterLink = () => {
    navigate('/register');
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" placeholder="Enter password" />
        <input type="submit" value="Login" />
      </form>

      <p>
        Don't have an account?
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleRegisterLink}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
