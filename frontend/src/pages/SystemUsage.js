import React, { useEffect, useState } from 'react';

function SystemUsage({ user, token }) {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setMessage('Failed to fetch analytics events'));
    fetch('/api/analytics/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setSummary)
      .catch(() => setMessage('Failed to fetch analytics summary'));
  }, [token]);

  return (
    <div>
      <h2>System Usage</h2>
      {message && <div style={{ color: 'red' }}>{message}</div>}
      <div style={{ marginBottom: 20 }}>
        <h4>Event Summary</h4>
        <ul>
          {summary.map(s => (
            <li key={s._id}><b>{s._id}:</b> {s.count}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Recent Events</h4>
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>User</th><th>Type</th><th>Data</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td>{e.user?.name || e.user}</td>
                <td>{e.type}</td>
                <td>{typeof e.data === 'object' ? JSON.stringify(e.data) : e.data}</td>
                <td>{e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemUsage; 