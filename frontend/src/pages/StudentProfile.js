import React, { useEffect, useState } from 'react';

function StudentProfile({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) setStudent(data);
        else setError(data.message || 'Not found');
        setLoading(false);
      })
      .catch(() => { setError('Failed to load'); setLoading(false); });
  }, [studentId]);

  if (!studentId) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!student) return null;

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <button onClick={onBack} style={{ marginBottom: 10 }}>Back to List</button>
      <h2>{student.name}</h2>
      <div><b>Admission #:</b> {student.admissionNumber}</div>
      <div><b>Class:</b> {student.class}</div>
      <div><b>Section:</b> {student.section}</div>
      <div><b>Email:</b> {student.email}</div>
      <div><b>Date of Birth:</b> {student.dob ? new Date(student.dob).toLocaleDateString() : ''}</div>
      <div><b>Gender:</b> {student.gender}</div>
      <div><b>Address:</b> {student.address}</div>
      <div><b>Phone:</b> {student.phone}</div>
      <div><b>Parent Name:</b> {student.parentName}</div>
      <div><b>Parent Contact:</b> {student.parentContact}</div>
      <div><b>Academic Info:</b> <pre>{JSON.stringify(student.academicInfo, null, 2)}</pre></div>
    </div>
  );
}

export default StudentProfile;
