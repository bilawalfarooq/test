import React, { useEffect, useState } from 'react';

function AdminUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch users
  useEffect(() => {
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        try {
          const data = await res.json();
          setUsers(data);
        } catch {
          setUsers([]);
        }
      });
  }, [token, message]);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create user
  const handleCreate = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: 'Invalid JSON response from server' };
    }
    if (res.ok) setMessage('User created!');
    else setMessage(data.message || 'Error');
  };

  // Start editing
  const startEdit = user => {
    setEditId(user._id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  // Update user
  const handleUpdate = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`/api/users/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, email: form.email, role: form.role })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: 'Invalid JSON response from server' };
    }
    if (res.ok) setMessage('User updated!');
    else setMessage(data.message || 'Error');
    setEditId(null);
    setForm({ name: '', email: '', password: '', role: 'student' });
  };

  // Delete user
  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setMessage('User deleted!');
    else setMessage('Delete failed');
  };

  return (
    <div>
      <h2>User Management</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <table border="1" cellPadding="6" style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => startEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={editId ? handleUpdate : handleCreate}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        {!editId && <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />}
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', email: '', password: '', role: 'student' }); }}>Cancel</button>}
      </form>
    </div>
  );
}

export default AdminUsers;
