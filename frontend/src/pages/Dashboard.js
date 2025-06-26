import React from 'react';
import AdminUsers from './AdminUsers';
import Courses from './Courses';
import Assignments from './Assignments';
import Grades from './Grades';
import Attendance from './Attendance';
import Forum from './Forum';
import Notifications from './Notifications';
import Badges from './Badges';
import Reports from './Reports';
import Progress from './Progress';
import SystemUsage from './SystemUsage';
import Settings from './Settings';
import ContactTeacher from './ContactTeacher';

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
  const token = localStorage.getItem('token');
  if (nav === 'users') content = <AdminUsers token={token} />;
  else if (nav === 'courses') content = <Courses user={user} token={token} />;
  else if (nav === 'reports') content = <Reports user={user} token={token} />;
  else if (nav === 'usage') content = <SystemUsage user={user} token={token} />;
  else if (nav === 'settings') content = <Settings user={user} token={token} />;
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
  const token = localStorage.getItem('token');
  if (nav === 'courses') content = <Courses user={user} token={token} />;
  else if (nav === 'grading') content = <><Attendance user={user} token={token} /><Grades user={user} token={token} /></>;
  else if (nav === 'assignments') content = <Assignments user={user} token={token} />;
  else if (nav === 'upload') content = <div>Upload Content (coming soon)</div>;
  else if (nav === 'forum') content = <Forum user={user} token={token} />;
  else if (nav === 'live') content = <div>Live Classes (coming soon)</div>;
  else if (nav === 'reports') content = <Reports user={user} token={token} />;
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
  const token = localStorage.getItem('token');
  if (nav === 'courses') content = <Courses user={user} token={token} />;
  else if (nav === 'assignments') content = <Assignments user={user} token={token} />;
  else if (nav === 'grades') content = <Grades user={user} token={token} />;
  else if (nav === 'forum') content = <Forum user={user} token={token} />;
  else if (nav === 'notifications') content = <Notifications user={user} token={token} />;
  else if (nav === 'certificates' || nav === 'badges') content = <Badges user={user} token={token} />;
  else if (nav === 'progress') content = <Progress user={user} token={token} />;
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
  const token = localStorage.getItem('token');
  if (nav === 'progress') content = <Progress user={user} token={token} />;
  else if (nav === 'grades') content = <Grades user={user} token={token} />;
  else if (nav === 'notifications') content = <Notifications user={user} token={token} />;
  else if (nav === 'contact') content = <ContactTeacher user={user} token={token} />;
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
