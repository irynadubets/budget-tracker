import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome back, {user.username}!</h1>
    </div>
  );
};

export default HomePage;
