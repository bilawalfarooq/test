import React, { useEffect, useState } from 'react';

function StaffList({ onSelect }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/staff', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load staff');
      setStaff(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleEdit = (s) => {
    setEditId(s._id);
    setEditForm({ ...s });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${editId}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setStaff(staff.map(s => s._id === editId ? data : s));
      setEditId(null);
      setMessage('Staff updated!');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setStaff(staff.filter(s => s._id !== id));
      setMessage('Staff deleted.');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.role && s.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Staff & Teacher List</h2>
      <input placeholder="Search by name, email, or role" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 10, width: 300 }} />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: message.includes('updated') ? 'green' : 'red', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <thead style={{ background: '#f1f1f1' }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Salary</th>
            <th>Subjects</th>
            <th>Assigned Classes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map(s => (
            <tr key={s._id}>
              <td>{editId === s._id ? <input name="name" value={editForm.name || ''} onChange={handleEditChange} /> : s.name}</td>
              <td>{editId === s._id ? <input name="email" value={editForm.email || ''} onChange={handleEditChange} /> : s.email}</td>
              <td>{editId === s._id ? <input name="role" value={editForm.role || ''} onChange={handleEditChange} /> : s.role}</td>
              <td>{editId === s._id ? <input name="phone" value={editForm.phone || ''} onChange={handleEditChange} /> : s.phone}</td>
              <td>{editId === s._id ? <input name="address" value={editForm.address || ''} onChange={handleEditChange} /> : s.address}</td>
              <td>{editId === s._id ? <input name="salary" value={editForm.salary || ''} onChange={handleEditChange} type="number" /> : s.salary}</td>
              <td>{editId === s._id ? <input name="subjects" value={editForm.subjects ? editForm.subjects.join(',') : ''} onChange={e => setEditForm({ ...editForm, subjects: e.target.value.split(',') })} /> : (s.subjects || []).join(', ')}</td>
              <td>{editId === s._id ? <input name="assignedClasses" value={editForm.assignedClasses ? editForm.assignedClasses.join(',') : ''} onChange={e => setEditForm({ ...editForm, assignedClasses: e.target.value.split(',') })} /> : (s.assignedClasses || []).join(', ')}</td>
              <td>
                {editId === s._id ? (
                  <>
                    <button onClick={handleEditSave} disabled={loading}>Save</button>
                    <button onClick={() => setEditId(null)} disabled={loading}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onSelect && onSelect(s)}>View</button>
                    <button onClick={() => handleEdit(s)} disabled={loading}>Edit</button>
                    <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }} disabled={loading}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffList;
