import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyGroups() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [joinedDepartments,setJoinedDepartments] = useState([])
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // console.log(user);
  // console.log(user.student_id);
  // console.log(user.email);

  
  useEffect(() => {
  const fetchJoinedDepartments = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/groups/${user.student_id}`)
          const data = await response.json()
          setJoinedDepartments(data);
        } catch (error) {
          console.error("Failed to fetch departments", error);
        } finally {
          setLoading(false);
        }
      };
      fetchJoinedDepartments();
    }, [])

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Navbar Structure Matching Dashboard */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EBDDD0] px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 rounded-xl text-[#3B3633]/70 hover:bg-[#EBDDD0]/50 transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-xl font-extrabold text-[#3B3633] tracking-tight hidden sm:block">
            StudyHub
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <button className="relative p-2.5 text-[#3B3633]/60 hover:bg-[#EBDDD0]/50 hover:text-[#3B3633] rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F4B7CC] rounded-full border-2 border-[#FAF7F2]"></span>
          </button>
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-[#B3CFF3] shadow-sm flex items-center justify-center text-[#3B3633] font-extrabold text-sm cursor-pointer border border-white/50">
            ME
          </Link>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#3B3633]/10 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#EBDDD0] flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl text-[#3B3633]/50 hover:bg-[#EBDDD0]/50 hover:text-[#3B3633] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
            <Link to="/dashboard" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
                <span className="text-xl">🏠</span> <span>Home Feed</span>
            </Link>
            <Link to="/groups" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl bg-[#EBDDD0]/50 text-[#3B3633] font-extrabold">
                <span className="text-xl">🤝</span> <span>My Groups</span>
            </Link>
            <Link to="/doubts" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
                <span className="text-xl">❓</span> <span>Doubts & Q&A</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
                <span className="text-xl">👤</span> <span>Profile</span>
            </Link>
        </div>
      </div>

      {/* Main Groups Content */}
      <main className="max-w-4xl mx-auto pt-8 px-4 pb-20">
        
        {/* Groups Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#FAF7F2] p-8 rounded-[2.5rem] shadow-sm border border-[#EBDDD0] mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#3B3633]">My Groups</h1>
            <p className="text-[#3B3633]/60 font-bold mt-2 text-sm max-w-sm">Connect with students from your departments and discuss your courses.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <button onClick={() => navigate('/explore-departments')} className="w-full md:w-auto bg-[#262423] hover:bg-black text-[#FAF7F2] font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5">
                + Explore Departments
            </button>
          </div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {joinedDepartments.map((dept) => (
            <div key={dept.dept_code} className="bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] p-8 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 ${dept.theme} text-[#3B3633] rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                    {dept.icon}
                  </div>
                  <span className="bg-[#F4B7CC]/20 text-[#3B3633] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#F4B7CC]/30">
                    {dept.newPosts} New Posts Today
                  </span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#3B3633] tracking-tight">{dept.code}</h3>
                <h4 className="text-sm font-extrabold text-[#3B3633]/60 mb-4">{dept.name}</h4>
                
                <p className="text-[#3B3633]/80 text-sm leading-relaxed font-bold mb-6">
                  {dept.description}
                </p>

                <div className="flex space-x-4 mb-8">
                  <div className="flex flex-col">
                    <span className="text-[#3B3633] font-extrabold text-lg">{dept.members}</span>
                    <span className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest">Members</span>
                  </div>
                  <div className="w-px bg-[#EBDDD0]"></div>
                  <div className="flex flex-col">
                    <span className="text-[#3B3633] font-extrabold text-lg">{dept.courses}</span>
                    <span className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest">Courses</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/groups/${dept.dept_code}`)}
                className="w-full bg-[#EBDDD0]/50 hover:bg-[#EBDDD0] text-[#3B3633] font-extrabold py-3.5 rounded-xl transition-colors text-sm text-center border border-white/30"
              >
                Open Group
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}