import React, { useEffect, useState } from 'react';

function Progress({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCourses);
    fetch('/api/assignments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setAssignments);
    fetch('/api/grades', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setGrades);
    fetch('/api/attendance', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setAttendance)
      .catch(() => setMessage('Failed to fetch progress data'));
  }, [token]);

  // Filter for this student
  const studentId = user.role === 'student' ? user._id : null; // For parent, could be their child's ID
  const myCourses = courses.filter(c => c.students?.some(s => s._id === studentId));
  const myAssignments = assignments.filter(a => myCourses.some(c => c._id === a.course));
  const myGrades = grades.filter(g => g.student?._id === studentId);
  const myAttendance = attendance.filter(a => a.records?.some(r => r.student === studentId));

  // Progress calculations
  const assignmentsCompleted = myAssignments.filter(a => a.submissions?.some(s => s.student === studentId)).length;
  const totalAssignments = myAssignments.length;
  const avgGrade = myGrades.length ? (myGrades.reduce((sum, g) => sum + (g.grade === 'A' ? 4 : g.grade === 'B' ? 3 : g.grade === 'C' ? 2 : 0), 0) / myGrades.length).toFixed(2) : 'N/A';
  const attendancePresent = myAttendance.reduce((sum, a) => sum + (a.records.find(r => r.student === studentId)?.present ? 1 : 0), 0);
  const attendanceTotal = myAttendance.length;

  return (
    <div>
      <h2>Progress Tracker</h2>
      {message && <div style={{ color: 'red' }}>{message}</div>}
      <div><b>Enrolled Courses:</b> {myCourses.length}</div>
      <div><b>Assignments Completed:</b> {assignmentsCompleted} / {totalAssignments}</div>
      <div><b>Average Grade:</b> {avgGrade}</div>
      <div><b>Attendance:</b> {attendancePresent} / {attendanceTotal} days present</div>
      <div style={{ marginTop: 20 }}>
        <h4>Courses</h4>
        <ul>
          {myCourses.map(c => <li key={c._id}>{c.title}</li>)}
        </ul>
        <h4>Assignments</h4>
        <ul>
          {myAssignments.map(a => <li key={a._id}>{a.title}</li>)}
        </ul>
        <h4>Grades</h4>
        <ul>
          {myGrades.map(g => <li key={g._id}>{g.grade} ({g.feedback})</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Progress; 