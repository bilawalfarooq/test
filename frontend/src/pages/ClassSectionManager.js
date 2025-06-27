import React, { useEffect, useState } from 'react';

function ClassSectionManager() {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({ className: '', section: '', teacher: '', capacity: '', academicYear: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/class-sections', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setSections(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const url = editId ? `http://localhost:5000/api/class-sections/${editId}` : 'http://localhost:5000/api/class-sections';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      setMessage(editId ? 'Section updated!' : 'Section added!');
      setForm({ className: '', section: '', teacher: '', capacity: '', academicYear: '' });
      setEditId(null);
      fetchSections();
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  const handleEdit = s => {
    setEditId(s._id);
    setForm({
      className: s.className,
      section: s.section,
      teacher: s.teacher || '',
      capacity: s.capacity || '',
      academicYear: s.academicYear || ''
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this section?')) return;
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/class-sections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setMessage('Section deleted.');
      fetchSections();
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Class & Section Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="className" placeholder="Class" value={form.className} onChange={handleChange} required />
        <input name="section" placeholder="Section" value={form.section} onChange={handleChange} required />
        <input name="teacher" placeholder="Teacher" value={form.teacher} onChange={handleChange} />
        <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} type="number" min="0" />
        <input name="academicYear" placeholder="Academic Year" value={form.academicYear} onChange={handleChange} />
        <button type="submit" disabled={loading}>{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ className: '', section: '', teacher: '', capacity: '', academicYear: '' }); }}>Cancel</button>}
      </form>
      {message && <div style={{ color: message.includes('deleted') ? 'red' : 'green', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <thead style={{ background: '#f1f1f1' }}>
          <tr>
            <th>Class</th>
            <th>Section</th>
            <th>Teacher</th>
            <th>Capacity</th>
            <th>Academic Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(s => (
            <tr key={s._id}>
              <td>{s.className}</td>
              <td>{s.section}</td>
              <td>{s.teacher}</td>
              <td>{s.capacity}</td>
              <td>{s.academicYear}</td>
              <td>
                <button onClick={() => handleEdit(s)} disabled={loading}>Edit</button>
                <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }} disabled={loading}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassSectionManager;
