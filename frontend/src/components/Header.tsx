import React, { useContext, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';

const Header: React.FC = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const authorizedMenuItems = (
    <List>
      <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
        <HomeIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Home" style={{ marginRight: '40px' }}  />
      </ListItem>
      <ListItem button component={Link} to="/statistics/day" onClick={toggleDrawer(false)}>
        <BarChartIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Day" style={{ marginRight: '40px' }} />
      </ListItem>
      <ListItem button component={Link} to="/statistics/week" onClick={toggleDrawer(false)}>
        <BarChartIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Week" style={{ marginRight: '40px' }} />
      </ListItem>
      <ListItem button component={Link} to="/statistics/month" onClick={toggleDrawer(false)}>
        <BarChartIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Month" style={{ marginRight: '40px' }} />
      </ListItem>
      <ListItem button component={Link} to="/statistics/year" onClick={toggleDrawer(false)}>
        <BarChartIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Year" style={{ marginRight: '40px' }} />
      </ListItem>
      <ListItem button component={Link} to="/statistics/total" onClick={toggleDrawer(false)}>
        <BarChartIcon style={{ marginRight: '8px' }} />
        <ListItemText primary="Total" style={{ marginRight: '40px' }} />
      </ListItem>
    </List>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" style={{ marginLeft: '20px' }}>
                {location.pathname === '/' ? 'Home' : 'Statistics'}
              </Typography>
              <IconButton color="inherit" style={{ marginLeft: 'auto', marginRight: '10px' }} onClick={logoutUser}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {user ? authorizedMenuItems : null}
      </Drawer>
    </div>
  );
};

export default Header;
