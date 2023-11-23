import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

const Header: React.FC = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        {user && location.pathname === '/' && (
          <Typography variant="h6" component="div">
            Home
          </Typography>
        )}
        {user ? (
          <>
            <IconButton color="inherit" style={{ marginLeft: 'auto', marginRight: '10px' }} onClick={logoutUser}>
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          (location.pathname === '/login' || location.pathname === '/register') && (
            <Typography variant="h6" component="div">
              {location.pathname === '/login' ? 'Login' : 'Register'}
            </Typography>
          )
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
