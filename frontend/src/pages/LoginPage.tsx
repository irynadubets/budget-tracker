import React, { FormEvent, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const {loginUser} = useContext(AuthContext);

  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" placeholder="Enter password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;
