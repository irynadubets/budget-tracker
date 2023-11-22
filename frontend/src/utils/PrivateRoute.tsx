import React, { useContext } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const { user } = useContext(AuthContext);

  return !user ? <Navigate to="/login" /> : <>{children}</>;
};

export default PrivateRoute;
