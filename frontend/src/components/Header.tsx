import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

const Header: React.FC = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        {user && (
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
          <Typography variant="h6" component="div">
            Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
