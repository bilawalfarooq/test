import React, { useEffect, useState } from 'react';

function Attendance({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch courses
  useEffect(() => {
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCourses);
  }, [token]);

  // Fetch attendance records for selected course
  useEffect(() => {
    if (selectedCourse) {
      fetch(`/api/attendance/course/${selectedCourse}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setAttendance);
      // Fetch students for marking attendance
      fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setStudents(data.filter(u => u.role === 'student')));
    } else {
      setAttendance([]);
      setStudents([]);
    }
  }, [selectedCourse, token, message]);

  // Mark attendance (admin/teacher)
  const handleMark = async e => {
    e.preventDefault();
    setMessage('');
    const records = students.map(s => ({ student: s._id, present: !!document.getElementById('att-' + s._id)?.checked }));
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ course: selectedCourse, date, records })
    });
    const data = await res.json();
    if (res.ok) setMessage('Attendance marked!');
    else setMessage(data.message || 'Error');
  };

  return (
    <div>
      <h2>Attendance</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      <div>
        <label>Course: </label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      {(user.role === 'admin' || user.role === 'teacher') && selectedCourse && (
        <form onSubmit={handleMark}>
          <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
          <table>
            <thead>
              <tr><th>Student</th><th>Present</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td><input type="checkbox" id={'att-' + s._id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit">Mark Attendance</button>
        </form>
      )}
      {selectedCourse && (
        <div style={{ marginTop: 20 }}>
          <h4>Attendance Records</h4>
          {attendance.map(a => (
            <div key={a._id} style={{ marginBottom: 10 }}>
              <b>{new Date(a.date).toLocaleDateString()}</b>
              <ul>
                {a.records.map(r => (
                  <li key={r.student}>{students.find(s => s._id === r.student)?.name || r.student}: {r.present ? 'Present' : 'Absent'}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attendance;
