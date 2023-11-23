import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Typography } from '@mui/material';

const HomePage: React.FC = () => {
  const { user, fetchUserData, balance } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  return (
    <div>
      <Typography variant="h4">Welcome back, {user.username}!</Typography>
      <Typography variant="h5">Your Balance: {balance.toFixed(2)}</Typography>
    </div>
  );
};

export default HomePage;
