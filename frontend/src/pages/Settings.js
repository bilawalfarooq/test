import React, { useEffect, useState } from 'react';

function Settings({ user, token }) {
  const [settings, setSettings] = useState([]);
  const [message, setMessage] = useState('');
  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetch('/api/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setSettings)
      .catch(() => setMessage('Failed to fetch settings'));
  }, [token, message]);

  const handleChange = (key, value) => setEdit({ ...edit, [key]: value });

  const handleUpdate = async (key) => {
    setMessage('');
    const res = await fetch(`/api/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ value: edit[key] })
    });
    if (res.ok) setMessage('Setting updated!');
    else setMessage('Update failed');
  };

  return (
    <div>
      <h2>Settings</h2>
      {message && <div style={{ color: message.includes('failed') ? 'red' : 'green' }}>{message}</div>}
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Key</th><th>Value</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {settings.map(s => (
            <tr key={s._id}>
              <td>{s.key}</td>
              <td>
                <input
                  value={edit[s.key] !== undefined ? edit[s.key] : s.value}
                  onChange={e => handleChange(s.key, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(s.key)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Settings; 