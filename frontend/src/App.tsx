import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StatisticsPage from './pages/StatisticsPage';
import Header from './components/Header';

import PrivateRoute from './utils/PrivateRoute';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/statistics/day" element={<PrivateRoute><StatisticsPage period="day" /></PrivateRoute>} />
          <Route path="/statistics/week" element={<PrivateRoute><StatisticsPage period="week" /></PrivateRoute>} />
          <Route path="/statistics/month" element={<PrivateRoute><StatisticsPage period="month" /></PrivateRoute>} />
          <Route path="/statistics/year" element={<PrivateRoute><StatisticsPage period="year" /></PrivateRoute>} />
          <Route path="/statistics/total" element={<PrivateRoute><StatisticsPage period="total" /></PrivateRoute>} />
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
