import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './LandingPage'
import AuthPage from './AuthPage';
import UserDashboard from './userDashboard';
import UserProfile from './userProfile';

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path = "/" element ={<LandingPage/>}></Route>
      <Route path = "/login" element={<AuthPage/>}/>
      <Route path = "/dashboard" element={<UserDashboard/>}/>
      <Route path="/profile" element={<UserProfile/>}/>
    </Routes>

    
  );
}

export default App
