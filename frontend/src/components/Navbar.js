import React from 'react';

function Navbar({ user, onLogout, onNav }) {
  if (!user) return null;
  let links = [];
  if (user.role === 'admin') {
    links = [
      { label: 'User Management', key: 'users' },
      { label: 'Course Creation', key: 'courses' },
      { label: 'Reports', key: 'reports' },
      { label: 'System Usage', key: 'usage' },
      { label: 'Settings', key: 'settings' }
    ];
  } else if (user.role === 'teacher') {
    links = [
      { label: 'My Courses', key: 'courses' },
      { label: 'Upload Content', key: 'upload' },
      { label: 'Attendance & Grading', key: 'grading' },
      { label: 'Q&A Forum', key: 'forum' },
      { label: 'Live Classes', key: 'live' },
      { label: 'Reports', key: 'reports' }
    ];
  } else if (user.role === 'student') {
    links = [
      { label: 'Enrolled Courses', key: 'courses' },
      { label: 'Assignments', key: 'assignments' },
      { label: 'Grades', key: 'grades' },
      { label: 'Q&A Forum', key: 'forum' },
      { label: 'Certificates', key: 'certificates' },
      { label: 'Progress Tracker', key: 'progress' }
    ];
  } else if (user.role === 'parent') {
    links = [
      { label: 'Student Progress', key: 'progress' },
      { label: 'Grades', key: 'grades' },
      { label: 'Notifications', key: 'notifications' },
      { label: 'Contact Teacher', key: 'contact' }
    ];
  }
  return (
    <nav style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
      {links.map(link => (
        <button key={link.key} onClick={() => onNav(link.key)}>{link.label}</button>
      ))}
      <button style={{ marginLeft: 'auto' }} onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
