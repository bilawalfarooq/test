import React, { useEffect, useState } from 'react';

function StudentList({ onSelect }) {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ class: '', section: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState('');
  // Add undo support
  const [undoStack, setUndoStack] = useState([]);
  const [undoMessage, setUndoMessage] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:5000/api/students?';
    if (filters.class) url += `class=${filters.class}&`;
    if (filters.section) url += `section=${filters.section}`;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load students');
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [filters]);

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setEditForm({ ...student });
    setUndoStack([]); // clear undo on new edit
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      // Save previous state for undo
      const prev = students.find(s => s._id === editId);
      setUndoStack([{ ...prev }, ...undoStack]);
      const res = await fetch(`http://localhost:5000/api/students/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setStudents(students.map(s => s._id === editId ? data : s));
      setEditId(null);
      setMessage('Student updated!');
      setUndoMessage('You can undo the last change.');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  const handleUndo = async () => {
    if (!undoStack.length) return;
    const prev = undoStack[0];
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/students/${prev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(prev)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Undo failed');
      setStudents(students.map(s => s._id === prev._id ? data : s));
      setUndoStack(undoStack.slice(1));
      setUndoMessage('Undo successful.');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    setLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setStudents(students.filter(s => s._id !== id));
      setMessage('Student deleted.');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Student List</h2>
      {undoMessage && (
        <div style={{ color: 'blue', marginBottom: 8 }}>
          {undoMessage} <button onClick={handleUndo} disabled={loading || !undoStack.length}>Undo</button>
        </div>
      )}
      <div style={{ marginBottom: 10 }}>
        <input name="class" placeholder="Class" value={filters.class} onChange={handleFilterChange} style={{ marginRight: 8 }} />
        <input name="section" placeholder="Section" value={filters.section} onChange={handleFilterChange} style={{ marginRight: 8 }} />
        <button onClick={fetchStudents} disabled={loading}>Filter</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: message.includes('updated') ? 'green' : 'red', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px #eee' }}>
        <thead style={{ background: '#f1f1f1' }}>
          <tr>
            <th>Name</th>
            <th>Admission #</th>
            <th>Class</th>
            <th>Section</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Parent Name</th>
            <th>Parent Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{editId === s._id ? <input name="name" value={editForm.name || ''} onChange={handleEditChange} /> : s.name}</td>
              <td>{editId === s._id ? <input name="admissionNumber" value={editForm.admissionNumber || ''} onChange={handleEditChange} /> : s.admissionNumber}</td>
              <td>{editId === s._id ? <input name="class" value={editForm.class || ''} onChange={handleEditChange} /> : s.class}</td>
              <td>{editId === s._id ? <input name="section" value={editForm.section || ''} onChange={handleEditChange} /> : s.section}</td>
              <td>{editId === s._id ? <input name="email" value={editForm.email || ''} onChange={handleEditChange} /> : s.email}</td>
              <td>{editId === s._id ? <input name="dob" type="date" value={editForm.dob ? editForm.dob.substring(0,10) : ''} onChange={handleEditChange} /> : (s.dob ? new Date(s.dob).toLocaleDateString() : '')}</td>
              <td>{editId === s._id ? (
                <select name="gender" value={editForm.gender || ''} onChange={handleEditChange}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : s.gender}</td>
              <td>{editId === s._id ? <input name="parentName" value={editForm.parentName || ''} onChange={handleEditChange} /> : s.parentName}</td>
              <td>{editId === s._id ? <input name="parentContact" value={editForm.parentContact || ''} onChange={handleEditChange} /> : s.parentContact}</td>
              <td>
                {editId === s._id ? (
                  <>
                    <button onClick={handleEditSave} disabled={loading}>Save</button>
                    <button onClick={() => setEditId(null)} disabled={loading}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onSelect && onSelect(s)}>View</button>
                    <button onClick={() => handleEdit(s)} disabled={loading}>Edit</button>
                    <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }} disabled={loading}>Delete</button>
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

export default StudentList;
