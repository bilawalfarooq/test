import React, { useEffect, useState } from 'react';

function Forum({ user, token }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });
  const [reply, setReply] = useState({});

  // Fetch courses for filtering
  useEffect(() => {
    fetch('/api/courses', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setCourses);
  }, [token]);

  // Fetch forum posts for selected course
  useEffect(() => {
    if (selectedCourse) {
      fetch(`/api/forum/course/${selectedCourse}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(setPosts);
    } else {
      setPosts([]);
    }
  }, [selectedCourse, token, message]);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Post new question
  const handlePost = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, course: selectedCourse })
    });
    const data = await res.json();
    if (res.ok) setMessage('Posted!');
    else setMessage(data.message || 'Error');
    setForm({ title: '', content: '' });
  };

  // Handle reply change
  const handleReplyChange = (id, value) => setReply({ ...reply, [id]: value });

  // Post reply
  const handleReply = async (id) => {
    setMessage('');
    const res = await fetch(`/api/forum/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: reply[id] })
    });
    const data = await res.json();
    if (res.ok) setMessage('Reply posted!');
    else setMessage(data.message || 'Error');
    setReply({ ...reply, [id]: '' });
  };

  return (
    <div>
      <h2>Q&A Forum</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <div>
        <label>Course: </label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      {selectedCourse && (
        <form onSubmit={handlePost} style={{ marginTop: 10 }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
          <button type="submit">Post Question</button>
        </form>
      )}
      <div style={{ marginTop: 20 }}>
        {posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ccc', marginBottom: 16, padding: 10 }}>
            <b>{post.title}</b> <span style={{ color: '#888' }}>by {post.author?.name}</span>
            <div>{post.content}</div>
            <div style={{ marginTop: 8 }}>
              <b>Replies:</b>
              <ul>
                {post.replies.map((r, i) => (
                  <li key={i}><b>{r.author?.name || 'Unknown'}:</b> {r.content}</li>
                ))}
              </ul>
              <input
                placeholder="Reply..."
                value={reply[post._id] || ''}
                onChange={e => handleReplyChange(post._id, e.target.value)}
              />
              <button onClick={() => handleReply(post._id)} disabled={!reply[post._id]}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum; 