import React, { useState } from 'react';

function StudentAdmissionForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '', email: '', admissionNumber: '', class: '', section: '', dob: '', gender: '', address: '', phone: '', parentName: '', parentContact: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Admission failed');
      setMessage('Student admitted!');
      setForm({ name: '', email: '', admissionNumber: '', class: '', section: '', dob: '', gender: '', address: '', phone: '', parentName: '', parentContact: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Student Admission</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="admissionNumber" placeholder="Admission Number" value={form.admissionNumber} onChange={handleChange} required />
      <input name="class" placeholder="Class" value={form.class} onChange={handleChange} required />
      <input name="section" placeholder="Section" value={form.section} onChange={handleChange} required />
      <input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
      <select name="gender" value={form.gender} onChange={handleChange} required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="parentName" placeholder="Parent Name" value={form.parentName} onChange={handleChange} />
      <input name="parentContact" placeholder="Parent Contact" value={form.parentContact} onChange={handleChange} />
      <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Admit Student'}</button>
      {message && <div style={{ marginTop: 10, color: message.includes('admitted') ? 'green' : 'red' }}>{message}</div>}
    </form>
  );
}

export default StudentAdmissionForm;
