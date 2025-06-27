import React, { useState } from 'react';

function LeaveRequestForm({ onSuccess }) {
  const [form, setForm] = useState({ from: '', to: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    const staffId = localStorage.getItem('staffId'); // or get from context
    try {
      const res = await fetch('http://localhost:5000/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, staff: staffId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setMessage('Leave request submitted!');
      setForm({ from: '', to: '', reason: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, maxWidth: 500 }}>
      <h3>Submit Leave Request</h3>
      <input name="from" type="date" value={form.from} onChange={handleChange} required />
      <input name="to" type="date" value={form.to} onChange={handleChange} required />
      <input name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} required />
      <button type="submit" disabled={loading}>Submit</button>
      {message && <div style={{ color: message.includes('submitted') ? 'green' : 'red', marginTop: 8 }}>{message}</div>}
    </form>
  );
}

export default LeaveRequestForm;
