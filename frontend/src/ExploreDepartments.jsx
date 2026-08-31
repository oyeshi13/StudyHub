import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { departmentService } from './services/departmentService';

export default function ExploreDepartments() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which departments the user has joined during this session
  const [joinedDepartments, setJoinedDepartments] = useState({});
  const [isJoining, setIsJoining] = useState({});
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/explore-departments/${user.student_id}`)
        const data = await response.json()
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [user.student_id]);

  const handleJoin = async (departmentId) => {
    if (joinedDepartments[departmentId]) return;
    
    setIsJoining(prev => ({ ...prev, [departmentId]: true }));
    try {
      // await departmentService.joinDepartment(departmentId);
      // setJoinedDepartments(prev => ({ ...prev, [departmentId]: true }));
      await fetch(`http://localhost:5000/join/${departmentId}/${user.student_id}`,{
        "method" : "POST"
      })
      setJoinedDepartments(prev => ({ ...prev, [departmentId]: true }))
    } catch (error) {
      alert("Failed to join department. Please try again.");
    } finally {
      setIsJoining(prev => ({ ...prev, [departmentId]: false }));
    }
  };

  // Filter based on Search
  const filteredDepartments = departments.filter(dept => 
    (dept.dept_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dept.dept_code == searchQuery));

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Navbar Pattern */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EBDDD0] px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-xl text-[#3B3633]/70 hover:bg-[#EBDDD0]/50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-xl font-extrabold text-[#3B3633] tracking-tight hidden sm:block">StudyHub</div>
        </div>
        <div className="flex items-center space-x-5">
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-[#B3CFF3] shadow-sm flex items-center justify-center text-[#3B3633] font-extrabold text-sm border border-white/50">ME</Link>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      {isMenuOpen && <div className="fixed inset-0 bg-[#3B3633]/10 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#EBDDD0] flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl text-[#3B3633]/50 hover:bg-[#EBDDD0]/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <Link to="/dashboard" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 font-extrabold transition-colors"><span className="text-xl">🏠</span> <span>Home Feed</span></Link>
          <Link to="/groups" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl bg-[#EBDDD0]/50 text-[#3B3633] font-extrabold"><span className="text-xl">🤝</span> <span>My Groups</span></Link>
          <Link to="/doubts" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 font-extrabold transition-colors"><span className="text-xl">❓</span> <span>Doubts & Q&A</span></Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto pt-8 px-4 pb-20">
        
        {/* Back Navigation */}
        <Link to="/groups" className="inline-flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] font-extrabold text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Back to My Groups</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#FAF7F2] p-8 rounded-[2.5rem] shadow-sm border border-[#EBDDD0] mb-8 animate-fade-in-up">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#3B3633]">Explore Departments</h1>
            <p className="text-[#3B3633]/60 font-bold mt-2 text-sm max-w-sm">Find your academic community, connect with students, and explore course discussions.</p>
          </div>
          
          <div className="w-full md:w-1/3 relative">
            <input 
              type="text" 
              placeholder="Search departments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EBDDD0]/40 border-none text-[#3B3633] text-sm font-bold rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 focus:bg-white transition-all placeholder-[#3B3633]/40" 
            />
            <svg className="w-5 h-5 text-[#3B3633]/40 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
           <div className="text-center py-10 text-[#3B3633]/50 font-bold">Loading departments...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-[2.5rem] border border-[#EBDDD0] p-12 text-center animate-fade-in-up">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-extrabold text-[#3B3633] mb-2">No departments found</h3>
            <p className="text-[#3B3633]/60 font-bold text-sm">Try searching using a different department name or code.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredDepartments.map((dept) => {
              const hasJoined = joinedDepartments[dept.dept_code];
              const joining = isJoining[dept.dept_code];

              return (
                <div key={dept.dept_code} className="bg-[#FAF7F2] rounded-[2rem] shadow-sm border border-[#EBDDD0] p-7 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className={`w-14 h-14 ${dept.theme} text-[#3B3633] rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                        {dept.icon}
                      </div>
                      <span className="bg-[#F4B7CC]/20 text-[#3B3633] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#F4B7CC]/30">
                        {dept.recentActivity} New Posts
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-[#3B3633] tracking-tight">{dept.dept_code}</h3>
                    <h4 className="text-sm font-extrabold text-[#3B3633]/60 mb-4">{dept.dept_name}</h4>
                    
                    {/* <p className="text-[#3B3633]/80 text-sm leading-relaxed font-bold mb-6 line-clamp-3">
                      {dept.description}
                    </p> */}

                    <div className="flex space-x-4 mb-8">
                      <div className="flex flex-col">
                        <span className="text-[#3B3633] font-extrabold text-lg">{dept.members}</span>
                        <span className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest">Members</span>
                      </div>
                      <div className="w-px bg-[#EBDDD0]"></div>
                      <div className="flex flex-col">
                        <span className="text-[#3B3633] font-extrabold text-lg">{dept.courseCount}</span>
                        <span className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest">Courses</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {hasJoined ? (
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-white border border-[#EBDDD0] text-[#3B3633] font-extrabold py-3.5 rounded-xl text-sm text-center flex items-center justify-center shadow-sm cursor-default">
                        <span className="text-[#B3CFF3] mr-2 text-lg leading-none">✓</span> Joined
                      </div>
                      <button 
                        onClick={() => navigate(`/groups/${dept.dept_code}`)}
                        className="flex-1 bg-[#262423] hover:bg-black text-[#FAF7F2] font-extrabold py-3.5 rounded-xl transition-colors text-sm shadow-md text-center"
                      >
                        Open Group →
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleJoin(dept.dept_code)}
                      disabled={joining}
                      className="w-full bg-[#EBDDD0]/50 hover:bg-[#EBDDD0] text-[#3B3633] font-extrabold py-3.5 rounded-xl transition-colors text-sm text-center border border-white/30"
                    >
                      {joining ? 'Joining...' : 'Join Group'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}