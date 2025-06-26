import React, { useEffect, useState } from 'react';

function ContactTeacher({ user, token }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ subject: '', content: '' });
  const [sent, setSent] = useState('');

  useEffect(() => {
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeachers(data.filter(u => u.role === 'teacher'));
        else setTeachers([]);
      });
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSend = e => {
    e.preventDefault();
    setSent('Message sent (simulated)!');
    setForm({ subject: '', content: '' });
  };

  return (
    <div>
      <h2>Contact Teacher</h2>
      {sent && <div style={{ color: 'green' }}>{sent}</div>}
      <div>
        <label>Teacher: </label>
        <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}>
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
        </select>
      </div>
      {selectedTeacher && (
        <form onSubmit={handleSend} style={{ marginTop: 10 }}>
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
          <textarea name="content" placeholder="Message" value={form.content} onChange={handleChange} required />
          <button type="submit">Send Message</button>
        </form>
      )}
      {selectedTeacher && (
        <div style={{ marginTop: 20 }}>
          <b>Contact Info:</b>
          <div>Name: {teachers.find(t => t._id === selectedTeacher)?.name}</div>
          <div>Email: {teachers.find(t => t._id === selectedTeacher)?.email}</div>
        </div>
      )}
    </div>
  );
}

export default ContactTeacher; 