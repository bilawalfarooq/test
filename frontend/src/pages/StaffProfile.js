import React, { useEffect, useState } from 'react';

function StaffProfile({ staffId }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!staffId) return;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/staff/${staffId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setStaff(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load staff');
        setLoading(false);
      });
  }, [staffId]);

  if (!staffId) return <div>Select a staff member to view profile.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!staff) return null;

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>{staff.name} ({staff.role})</h2>
      <div>Email: {staff.email}</div>
      <div>Phone: {staff.phone}</div>
      <div>Address: {staff.address}</div>
      <div>Salary: {staff.salary}</div>
      <div>Subjects: {(staff.subjects || []).join(', ')}</div>
      <div>Assigned Classes: {(staff.assignedClasses || []).join(', ')}</div>
      <h4>Salary Records</h4>
      <ul>
        {(staff.salaryRecords || []).map((rec, i) => (
          <li key={i}>{rec.month}: {rec.amount} (Paid: {rec.paidDate ? new Date(rec.paidDate).toLocaleDateString() : 'N/A'})</li>
        ))}
      </ul>
    </div>
  );
}

export default StaffProfile;
