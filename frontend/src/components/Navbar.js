import React from 'react';
import './Navbar.css';

function Navbar({ user, onLogout, onNav }) {
  if (!user) return null;
  let links = [
    { label: 'Profile', key: 'profile' }
  ];
  if (user.role === 'admin') {
    links = [
      { label: 'Profile', key: 'profile' },
      { label: 'User Management', key: 'users' },
      { label: 'Student List', key: 'students' },
      { label: 'Add Student', key: 'admit' },
      { label: 'Course Creation', key: 'courses' },
      { label: 'Staff/Teachers', key: 'staff' },
      { label: 'Add Staff', key: 'addstaff' },
      { label: 'Leave Requests', key: 'leaverequests' },
      { label: 'Reports', key: 'reports' },
      { label: 'System Usage', key: 'usage' },
      { label: 'Settings', key: 'settings' },
      { label: 'Class/Section Mgmt', key: 'classsections' }
    ];
  } else if (user.role === 'teacher') {
    links = [
      { label: 'Profile', key: 'profile' },
      { label: 'My Courses', key: 'courses' },
      { label: 'Upload Content', key: 'upload' },
      { label: 'Attendance & Grading', key: 'grading' },
      { label: 'Q&A Forum', key: 'forum' },
      { label: 'Live Classes', key: 'live' },
      { label: 'Reports', key: 'reports' }
    ];
  } else if (user.role === 'student') {
    links = [
      { label: 'Profile', key: 'profile' },
      { label: 'Enrolled Courses', key: 'courses' },
      { label: 'Assignments', key: 'assignments' },
      { label: 'Grades', key: 'grades' },
      { label: 'Q&A Forum', key: 'forum' },
      { label: 'Certificates', key: 'certificates' },
      { label: 'Progress Tracker', key: 'progress' }
    ];
  } else if (user.role === 'parent') {
    links = [
      { label: 'Profile', key: 'profile' },
      { label: 'Student Progress', key: 'progress' },
      { label: 'Grades', key: 'grades' },
      { label: 'Notifications', key: 'notifications' },
      { label: 'Contact Teacher', key: 'contact' }
    ];
  }
  return (
    <nav className="navbar">
      {links.map(link => (
        <button key={link.key} onClick={() => onNav(link.key)}>{link.label}</button>
      ))}
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
