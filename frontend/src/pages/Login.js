import React, { useState } from 'react';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import VerifyEmailModal from '../components/VerifyEmailModal';


function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      onLogin && onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <div style={{ marginTop: 10 }}>
        <button type="button" onClick={() => setShowForgot(true)} style={{ marginRight: 8 }}>Forgot Password?</button>
        <button type="button" onClick={() => setShowReset(true)} style={{ marginRight: 8 }}>Reset Password</button>
        <button type="button" onClick={() => setShowVerify(true)}>Verify Email</button>
      </div>
      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
      <ResetPasswordModal open={showReset} onClose={() => setShowReset(false)} />
      <VerifyEmailModal open={showVerify} onClose={() => setShowVerify(false)} />
    </div>
  );
}

export default Login;
