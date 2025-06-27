import React, { useState } from 'react';

function StaffForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', role: '', phone: '', address: '', salary: '', subjects: '', assignedClasses: '', password: '' });
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
    try {
      const res = await fetch('http://localhost:5000/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          salary: form.salary ? Number(form.salary) : undefined,
          subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()) : [],
          assignedClasses: form.assignedClasses ? form.assignedClasses.split(',').map(c => c.trim()) : [],
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Add failed');
      setMessage('Staff added!');
      setForm({ name: '', email: '', role: '', phone: '', address: '', salary: '', subjects: '', assignedClasses: '', password: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, maxWidth: 600 }}>
      <h3>Add/Update Staff</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="role" placeholder="Role (teacher/admin/staff)" value={form.role} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} type="number" min="0" />
      <input name="subjects" placeholder="Subjects (comma separated)" value={form.subjects} onChange={handleChange} />
      <input name="assignedClasses" placeholder="Assigned Classes (comma separated)" value={form.assignedClasses} onChange={handleChange} />
      <input name="password" placeholder="Password (for login)" value={form.password} onChange={handleChange} type="password" />
      <button type="submit" disabled={loading}>Add Staff</button>
      {message && <div style={{ color: message.includes('added') ? 'green' : 'red', marginTop: 8 }}>{message}</div>}
    </form>
  );
}

export default StaffForm;
