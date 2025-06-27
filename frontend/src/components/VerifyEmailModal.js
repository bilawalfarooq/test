import React, { useState } from 'react';

function VerifyEmailModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const params = new URLSearchParams({ email, token });
      const res = await fetch(`http://localhost:5000/api/auth/verify-email?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to verify email');
      setMessage('Email verified! You can now log in.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Verify Email</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="text" placeholder="Verification Token" value={token} onChange={e => setToken(e.target.value)} required />
          <button type="submit">Verify Email</button>
        </form>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default VerifyEmailModal;
