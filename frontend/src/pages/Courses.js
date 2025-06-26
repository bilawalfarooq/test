import React, { useEffect, useState } from 'react';

function Courses({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', teacher: '' });
  const [message, setMessage] = useState('');

  // Fetch courses
  useEffect(() => {
    fetch('/api/courses', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCourses);
  }, [token, message]);

  // Fetch teachers for course creation
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'teacher')) {
      fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTeachers(data.filter(u => u.role === 'teacher'));
          else setTeachers([]);
        });
    }
  }, [user, token]);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create course
  const handleCreate = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) setMessage('Course created!');
    else setMessage(data.message || 'Error');
  };

  // Enroll in course
  const handleEnroll = async id => {
    setMessage('');
    const res = await fetch(`/api/courses/${id}/enroll`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setMessage('Enrolled!');
    else setMessage(data.message || 'Error');
  };

  return (
    <div>
      <h2>Courses</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Description</th><th>Teacher</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.teacher?.name}</td>
              <td>
                {user.role === 'student' && <button onClick={() => handleEnroll(c._id)}>Enroll</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(user.role === 'admin' || user.role === 'teacher') && (
        <form onSubmit={handleCreate}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <select name="teacher" value={form.teacher} onChange={handleChange} required>
            <option value="">Select Teacher</option>
            {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <button type="submit">Create Course</button>
        </form>
      )}
    </div>
  );
}

export default Courses;
