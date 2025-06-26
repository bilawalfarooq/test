import React from 'react';
import AdminUsers from './AdminUsers';

function Dashboard({ user, nav }) {
  if (!user) return null;
  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} nav={nav} />;
    case 'teacher':
      return <TeacherDashboard user={user} nav={nav} />;
    case 'student':
      return <StudentDashboard user={user} nav={nav} />;
    case 'parent':
      return <ParentDashboard user={user} nav={nav} />;
    default:
      return <div>Unknown role</div>;
  }
}

function AdminDashboard({ user, nav }) {
  let content = null;
  if (nav === 'users') content = <AdminUsers token={localStorage.getItem('token')} />;
  else if (nav === 'courses') content = <div>Course Creation (coming soon)</div>;
  else if (nav === 'reports') content = <div>Reports (coming soon)</div>;
  else if (nav === 'usage') content = <div>System Usage (coming soon)</div>;
  else if (nav === 'settings') content = <div>Settings (coming soon)</div>;
  else content = <div>Select an option from the navbar.</div>;
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      {content}

    </div>
  );
}

function TeacherDashboard({ user, nav }) {
  let content = null;
  if (nav === 'courses') content = <div>My Courses (coming soon)</div>;
  else if (nav === 'upload') content = <div>Upload Content (coming soon)</div>;
  else if (nav === 'grading') content = <div>Attendance & Grading (coming soon)</div>;
  else if (nav === 'forum') content = <div>Q&A Forum (coming soon)</div>;
  else if (nav === 'live') content = <div>Live Classes (coming soon)</div>;
  else if (nav === 'reports') content = <div>Reports (coming soon)</div>;
  else content = <div>Select an option from the navbar.</div>;
  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      {content}
    </div>
  );
}

function StudentDashboard({ user, nav }) {
  let content = null;
  if (nav === 'courses') content = <div>Enrolled Courses (coming soon)</div>;
  else if (nav === 'assignments') content = <div>Assignments (coming soon)</div>;
  else if (nav === 'grades') content = <div>Grades (coming soon)</div>;
  else if (nav === 'forum') content = <div>Q&A Forum (coming soon)</div>;
  else if (nav === 'certificates') content = <div>Certificates (coming soon)</div>;
  else if (nav === 'progress') content = <div>Progress Tracker (coming soon)</div>;
  else content = <div>Select an option from the navbar.</div>;
  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      {content}
    </div>
  );
}

function ParentDashboard({ user, nav }) {
  let content = null;
  if (nav === 'progress') content = <div>Student Progress (coming soon)</div>;
  else if (nav === 'grades') content = <div>Grades (coming soon)</div>;
  else if (nav === 'notifications') content = <div>Notifications (coming soon)</div>;
  else if (nav === 'contact') content = <div>Contact Teacher (coming soon)</div>;
  else content = <div>Select an option from the navbar.</div>;
  return (
    <div>
      <h2>Parent Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      {content}
    </div>
  );
}

export default Dashboard;
