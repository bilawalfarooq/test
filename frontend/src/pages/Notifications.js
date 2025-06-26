import React, { useEffect, useState } from 'react';

function Notifications({ user, token }) {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setNotifications)
      .catch(() => setMessage('Failed to fetch notifications'));
  }, [token]);

  return (
    <div>
      <h2>Notifications</h2>
      {message && <div style={{ color: 'red' }}>{message}</div>}
      <ul>
        {notifications.map(n => (
          <li key={n._id} style={{ marginBottom: 10 }}>
            <b>{n.type.toUpperCase()}</b>: {n.message}
            <span style={{ color: '#888', marginLeft: 8 }}>{new Date(n.createdAt).toLocaleString()}</span>
            {n.read ? <span style={{ color: 'green', marginLeft: 8 }}>(Read)</span> : <span style={{ color: 'orange', marginLeft: 8 }}>(Unread)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications; 