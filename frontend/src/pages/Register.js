import React, { useState } from 'react';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import VerifyEmailModal from '../components/VerifyEmailModal';


function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const handleChange = e => {
    // Prevent role from being changed
    if (e.target.name === 'role') return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess('Registration successful! You can now log in.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {/* Role selection removed: only students can register */}
        <button type="submit">Register as Student</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
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

export default Register;
