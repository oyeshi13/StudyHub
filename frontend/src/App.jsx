import { Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './LandingPage'
import AuthPage from './AuthPage';
import UserDashboard from './userDashboard';
import UserProfile from './userProfile';
import MyGroups from './MyGroups';
import GroupPage from './GroupPage';
import Doubts from './Doubts';
import DoubtDetails from './DoubtDetails';
import ExploreDepartments from './ExploreDepartments';
import AdminDashboard from "./AdminDashboard";
import BookmarkedPosts from './BookmarkedPosts';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/groups" element={<MyGroups />} />
        <Route path="/groups/:departmentId" element={<GroupPage />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/doubts/:doubtId" element={<DoubtDetails />} />
        <Route path="/explore-departments" element={<ExploreDepartments />} />
        <Route path="/bookmarks" element={<BookmarkedPosts />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;