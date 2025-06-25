
import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const [nav, setNav] = useState(null);
  if (!user) {
    return (
      <div>
        {showRegister ? <Register /> : <Login onLogin={setUser} />}
        <button onClick={() => setShowRegister(r => !r)} style={{ marginTop: 10 }}>
          {showRegister ? 'Already have an account? Login' : 'No account? Register'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Navbar user={user} onLogout={() => { setUser(null); localStorage.removeItem('token'); }} onNav={setNav} />
      <Dashboard user={user} nav={nav} />
    </div>
  );
}

export default App;
