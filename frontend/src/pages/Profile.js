import React, { useState, useEffect } from 'react';

function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', avatar: '' });
  const [message, setMessage] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    // Load user from localStorage or API
    const saved = localStorage.getItem('user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      setForm({ name: u.name, email: u.email, avatar: u.avatar || '' });
      if (u.avatar) {
        setAvatarPreview(`http://localhost:5000/uploads/avatars/${u.avatar}`);
      }
    }
  }, []);

  const getUserId = user ? (user._id || user.id) : null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${getUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setEdit(false);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const res = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Avatar upload failed');
      // Fetch updated user from backend
      const userRes = await fetch(`http://localhost:5000/api/users/${getUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = await userRes.json();
      setForm(f => ({ ...f, avatar: data.avatar }));
      setAvatarPreview(`http://localhost:5000/uploads/avatars/${data.avatar}`);
      setUser(updatedUser);
      // Ensure form.avatar is always set to the latest avatar from backend
      setForm(f => ({ ...f, avatar: updatedUser.avatar || data.avatar }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('Avatar updated!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Profile</h2>
      {edit ? (
        <form onSubmit={handleSave} encType="multipart/form-data">
          <input name="name" value={form.name} onChange={handleChange} required />
          <input name="email" value={form.email} onChange={handleChange} required />
          <div style={{ margin: '10px 0' }}>
            <label>Avatar: </label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatarPreview && (
              <div><img src={avatarPreview} alt="avatar preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginTop: 8 }} /></div>
            )}
            <button type="button" onClick={handleAvatarUpload} disabled={!avatarFile}>Upload Avatar</button>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <div><b>Name:</b> {user.name}</div>
          <div><b>Email:</b> {user.email}</div>
          {user.avatar && (
            <div style={{ margin: '10px 0' }}>
              <img src={`http://localhost:5000/uploads/avatars/${user.avatar}`} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
      {message && <div style={{ color: message.includes('updated') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}

export default Profile;
