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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/groups" element={<MyGroups />} />
      <Route path="/groups/:departmentId" element={<GroupPage />} />
      <Route path="/doubts" element={<Doubts />} />
      <Route path="/doubts/:doubtId" element={<DoubtDetails />} />
      <Route path="/explore-departments" element={<ExploreDepartments />} />
    </Routes>
  );
}

export default App;