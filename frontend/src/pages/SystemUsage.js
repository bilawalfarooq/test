
import React, { useEffect, useState } from 'react';
import './SystemUsage.css';


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
    <div className="system-usage-container">
      <h2 className="system-usage-title">System Usage</h2>
      {message && <div className="system-usage-message">{message}</div>}
      <div className="system-usage-summary">
        <h4>Event Summary</h4>
        <ul>
          {summary.map(s => (
            <li key={s._id}><b>{s._id}:</b> {s.count}</li>
          ))}
        </ul>
      </div>
      <div className="system-usage-table-container">
        <h4 style={{marginTop:0}}>Recent Events</h4>
        <table className="system-usage-table">
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
                <td>
                  {(() => {
                    if (typeof e.data === 'object' && e.data.device) {
                      switch (e.data.device) {
                        case 'web':
                          return <span title="Web"><span style={{fontSize:'1.3em'}} role="img" aria-label="Web">🌐</span> Web</span>;
                        case 'mobile':
                          return <span title="Mobile"><span style={{fontSize:'1.3em'}} role="img" aria-label="Mobile">📱</span> Mobile</span>;
                        case 'desktop':
                          return <span title="Desktop"><span style={{fontSize:'1.3em'}} role="img" aria-label="Desktop">🖥️</span> Desktop</span>;
                        default:
                          return e.data.device;
                      }
                    }
                    return typeof e.data === 'object' ? JSON.stringify(e.data) : e.data;
                  })()}
                </td>
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