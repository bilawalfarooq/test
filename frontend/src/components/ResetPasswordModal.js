import React, { useState } from 'react';

function ResetPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setMessage('Password reset successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="text" placeholder="Reset Token" value={token} onChange={e => setToken(e.target.value)} required />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <button type="submit">Reset Password</button>
        </form>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
