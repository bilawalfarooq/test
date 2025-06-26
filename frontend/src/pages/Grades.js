import React, { useEffect, useState } from 'react';

function Grades({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student: '', grade: '', feedback: '' });
  const [message, setMessage] = useState('');

  // Fetch courses
  useEffect(() => {
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCourses);
  }, [token]);

  // Fetch students for grading
  useEffect(() => {
    if (user.role === 'admin' || user.role === 'teacher') {
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setStudents(data.filter(u => u.role === 'student')));
    }
  }, [user, token]);

  // Fetch grades for selected course
  useEffect(() => {
    if (selectedCourse) {
      fetch(`/api/grades/course/${selectedCourse}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setGrades);
    } else {
      setGrades([]);
    }
  }, [selectedCourse, token, message]);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Assign grade (admin/teacher)
  const handleAssign = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, course: selectedCourse })
    });
    const data = await res.json();
    if (res.ok) setMessage('Grade assigned!');
    else setMessage(data.message || 'Error');
  };

  return (
    <div>
      <h2>Grades</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <div>
        <label>Course: </label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      <table border="1" cellPadding="6" style={{ marginBottom: 20, marginTop: 10 }}>
        <thead>
          <tr>
            <th>Student</th><th>Grade</th><th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(g => (
            <tr key={g._id}>
              <td>{g.student?.name}</td>
              <td>{g.grade}</td>
              <td>{g.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(user.role === 'admin' || user.role === 'teacher') && selectedCourse && (
        <form onSubmit={handleAssign}>
          <select name="student" value={form.student} onChange={handleChange} required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <input name="grade" placeholder="Grade" value={form.grade} onChange={handleChange} required />
          <input name="feedback" placeholder="Feedback" value={form.feedback} onChange={handleChange} />
          <button type="submit">Assign Grade</button>
        </form>
      )}
    </div>
  );
}

export default Grades;
