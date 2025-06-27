import React, { useEffect, useState } from 'react';

function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        else setError(data.message || 'Failed to load users');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setUsers(users.map(u => u._id === data._id ? data : u));
      setEditUser(null);
      setSuccess('User updated!');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setUsers(users.filter(u => u._id !== id));
      setSuccess('User deleted.');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleCreateChange = e => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create failed');
      setUsers([...users, { ...createForm, _id: data._id, role: createForm.role }]);
      setCreating(false);
      setCreateForm({ name: '', email: '', password: '', role: 'student' });
      setSuccess('User created!');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>User Directory</h2>
      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: 8, marginBottom: 10, borderRadius: 4, border: '1px solid #c3e6cb', position: 'relative' }}>
          {success}
          <button onClick={() => setSuccess('')} style={{ position: 'absolute', right: 8, top: 4, background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>&times;</button>
        </div>
      )}
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: 8, marginBottom: 10, borderRadius: 4, border: '1px solid #f5c6cb', position: 'relative' }}>
          {error}
          <button onClick={() => setError('')} style={{ position: 'absolute', right: 8, top: 4, background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>&times;</button>
        </div>
      )}
      {loading && <div style={{ color: '#888', marginBottom: 10 }}>Loading...</div>}
      <button onClick={() => setCreating(c => !c)} disabled={loading} style={{ marginBottom: 10 }}>{creating ? 'Cancel' : 'Add User'}</button>
      {creating && (
        <div style={{ margin: '10px 0', border: '1px solid #ccc', padding: 10, borderRadius: 6, background: '#f9f9f9' }}>
          <input name="name" placeholder="Name" value={createForm.name} onChange={handleCreateChange} disabled={loading} style={{ marginRight: 8 }} />
          <input name="email" placeholder="Email" value={createForm.email} onChange={handleCreateChange} disabled={loading} style={{ marginRight: 8 }} />
          <input name="password" placeholder="Password" type="password" value={createForm.password} onChange={handleCreateChange} disabled={loading} style={{ marginRight: 8 }} />
          <select name="role" value={createForm.role} onChange={handleCreateChange} disabled={loading} style={{ marginRight: 8 }}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleCreate} disabled={loading}>Create</button>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <thead style={{ background: '#f1f1f1' }}>
          <tr>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={editUser && editUser._id === u._id ? { background: '#e3f2fd' } : {}}>
              <td style={{ padding: 8 }}>{editUser && editUser._id === u._id ? <input name="name" value={editForm.name} onChange={handleEditChange} disabled={loading} /> : u.name}</td>
              <td style={{ padding: 8 }}>{editUser && editUser._id === u._id ? <input name="email" value={editForm.email} onChange={handleEditChange} disabled={loading} /> : u.email}</td>
              <td style={{ padding: 8 }}>{editUser && editUser._id === u._id ? (
                <select name="role" value={editForm.role} onChange={handleEditChange} disabled={loading}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              ) : u.role}</td>
              <td style={{ padding: 8 }}>
                {editUser && editUser._id === u._id ? (
                  <>
                    <button onClick={handleEditSave} disabled={loading}>Save</button>
                    <button onClick={() => setEditUser(null)} disabled={loading}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(u)} disabled={loading}>Edit</button>
                    <button onClick={() => handleDelete(u._id)} style={{ color: 'red' }} disabled={loading}>Delete</button>
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

export default UserDirectory;
