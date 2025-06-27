import './App.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPasswordPage from './pages/ResetPasswordPage';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function AppRouter() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showRegister, setShowRegister] = useState(false);
  const [nav, setNav] = useState(null);

  // Save user to localStorage on login
  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
  };

  // Logout clears user
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
          !user ? (
            <div>
              {showRegister ? <Register /> : <Login onLogin={handleLogin} />}
              <button onClick={() => setShowRegister(r => !r)} style={{ marginTop: 10 }}>
                {showRegister ? 'Already have an account? Login' : 'No account? Register'}
              </button>
            </div>
          ) : (
            <div>
              <Navbar user={user} onLogout={handleLogout} onNav={setNav} />
              <Dashboard user={user} nav={nav} />
            </div>
          )
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
