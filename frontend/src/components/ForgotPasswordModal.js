import React, { useState } from 'react';

function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset email');
      setMessage('Reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit">Send Reset Email</button>
        </form>
        {message && <div style={{ color: 'green' }}>{message}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
