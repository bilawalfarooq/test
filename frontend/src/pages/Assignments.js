import React, { useEffect, useState } from 'react';

function Assignments({ user, token }) {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', course: '', dueDate: '' });
  const [message, setMessage] = useState('');

  // Fetch courses for assignment creation and filtering
  useEffect(() => {
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCourses);
  }, [token]);

  // Fetch assignments for selected course
  useEffect(() => {
    if (form.course) {
      fetch(`/api/assignments/course/${form.course}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setAssignments);
    } else {
      setAssignments([]);
    }
  }, [form.course, token, message]);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Create assignment (teacher/admin)
  const handleCreate = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) setMessage('Assignment created!');
    else setMessage(data.message || 'Error');
  };

  // Submit assignment (student)
  const handleSubmit = async id => {
    setMessage('');
    // For demo: just send a dummy fileUrl
    const res = await fetch(`/api/assignments/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fileUrl: 'https://example.com/file.pdf' })
    });
    const data = await res.json();
    if (res.ok) setMessage('Assignment submitted!');
    else setMessage(data.message || 'Error');
  };

  return (
    <div>
      <h2>Assignments</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      <div>
        <label>Filter by Course: </label>
        <select name="course" value={form.course} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Description</th><th>Due Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ''}</td>
              <td>
                {user.role === 'student' && <button onClick={() => handleSubmit(a._id)}>Submit</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(user.role === 'admin' || user.role === 'teacher') && (
        <form onSubmit={handleCreate}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          <select name="course" value={form.course} onChange={handleChange} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
          <button type="submit">Create Assignment</button>
        </form>
      )}
    </div>
  );
}

export default Assignments;
