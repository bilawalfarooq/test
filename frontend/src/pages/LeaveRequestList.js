import React, { useEffect, useState } from 'react';

function LeaveRequestList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/leave-requests', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load leave requests');
      setLeaves(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleStatus = async (id, status) => {
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/leave-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setLeaves(leaves.map(l => l._id === id ? data : l));
      setMessage('Status updated!');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Leave Requests</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: message.includes('updated') ? 'green' : 'red', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <thead style={{ background: '#f1f1f1' }}>
          <tr>
            <th>Staff</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td>{l.staff ? l.staff.name : ''}</td>
              <td>{l.from ? new Date(l.from).toLocaleDateString() : ''}</td>
              <td>{l.to ? new Date(l.to).toLocaleDateString() : ''}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
                {l.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatus(l._id, 'approved')} disabled={loading}>Approve</button>
                    <button onClick={() => handleStatus(l._id, 'rejected')} disabled={loading}>Reject</button>
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

export default LeaveRequestList;
