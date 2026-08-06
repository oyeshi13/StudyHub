import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SUB-COMPONENTS ---

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAF7F2]/80 border-b border-[#EBDDD0] py-4 px-6 flex justify-between items-center">
    
    {/* Logo and Brand Section */}
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-[#F6DEBA] shadow-sm">
        <div className="w-4 h-4 bg-[#3B3633] rounded-full"></div>
        <div className="w-6 h-6 border-4 border-[#D1BCFA] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#3B3633] rounded-full"></div>
        </div>
        <div className="w-4 h-4 bg-[#B3CFF3] rounded-full"></div>
      </div>
      
      <div className="text-2xl font-extrabold text-[#3B3633] tracking-tight">
        StudyHub
      </div>
    </div>
    
    <div className="hidden md:flex space-x-8 text-sm font-bold text-[#3B3633]/60">
      <a href="#" className="hover:text-[#3B3633] transition-colors">Study Groups</a>
      <a href="#" className="hover:text-[#3B3633] transition-colors">Resources</a>
      <a href="#" className="hover:text-[#3B3633] transition-colors">Leaderboard</a>
    </div>
    
    <button className="bg-[#262423] hover:bg-black text-[#FAF7F2] px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5" 
            onClick={()=> navigate("/login")}>
      Get Started
    </button>
  </nav>
  )
}

const HeroSection = () => (
  <section className="relative flex flex-col items-center text-center pt-28 pb-20 px-6 overflow-hidden bg-[#FAF7F2]">
    {/* Decorative Background Blobs */}
    <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#F6DEBA] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
    <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#D1BCFA] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>

    <h1 className="text-5xl md:text-6xl font-extrabold text-[#3B3633] mb-7 tracking-tighter z-10 leading-[1.1]">
      Your complete hub for <br/>
      <span className="text-[#3B3633]/70">
        connected studying.
      </span>
    </h1>
    <p className="text-lg text-[#3B3633]/70 mb-11 max-w-2xl z-10 leading-relaxed font-bold">
      StudyHub is a platform where students unite to share top-tier notes, solve complex doubts, and excel together. Earn reputation and badges as you build your academic portfolio.
    </p>
    <div className="flex space-x-5 z-10">
      <button className="bg-[#262423] hover:bg-black text-[#FAF7F2] font-bold py-4 px-10 rounded-2xl shadow-lg shadow-black/10 transition-all transform hover:-translate-y-1">
        Find Resources
      </button>
      <button className="bg-[#FAF7F2] border border-[#EBDDD0] hover:bg-[#EBDDD0]/50 text-[#3B3633] font-bold py-4 px-10 rounded-2xl shadow-sm transition-all">
        Join a Group
      </button>
    </div>
  </section>
);

const InteractiveDashboard = () => {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto z-10 relative">
      <div className="bg-[#FAF7F2] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#EBDDD0] overflow-hidden p-3">
        
        {/* Tab Headers */}
        <div className="flex bg-[#EBDDD0]/50 rounded-[2rem] p-1.5 mb-5">
          {['notes', 'groups', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold capitalize transition-all duration-200 flex items-center justify-center space-x-2.5 rounded-[1.5rem] ${
                activeTab === tab 
                  ? 'text-[#3B3633] bg-[#FAF7F2] shadow-sm' 
                  : 'text-[#3B3633]/50 hover:text-[#3B3633] hover:bg-[#FAF7F2]/50'
              }`}
            >
              <span className="text-lg">
                {tab === 'notes' ? '📚' : tab === 'groups' ? '🤝' : '🏅'}
              </span>
              <span>
                {tab === 'notes' ? 'Recent Notes' : tab === 'groups' ? 'Active Groups' : 'Top Contributors'}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[350px]">
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div className="p-8 border-none rounded-[2.5rem] shadow-sm hover:shadow-md transition-all bg-[#F6DEBA] hover:-translate-y-1 transition-transform duration-300">
                <div className="text-[10px] font-extrabold text-[#3B3633] mb-3 uppercase tracking-widest bg-white/40 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Data Structures</div>
                <h4 className="text-xl font-extrabold text-[#3B3633] mb-3 tracking-tight">Advanced Dynamic Programming Patterns</h4>
                <p className="text-[#3B3633]/70 text-sm mb-6 leading-relaxed font-bold">A complete guide to complex DP problems, broken down step-by-step with pseudocode.</p>
                <div className="flex items-center justify-between text-sm pt-5 border-t border-[#3B3633]/10">
                  <span className="font-bold text-[#3B3633]">By Fabiha Ishrah</span>
                  <span className="text-[#3B3633]/50 font-bold text-xs">2 hrs ago</span>
                </div>
              </div>
              <div className="p-8 border-none rounded-[2.5rem] shadow-sm hover:shadow-md transition-all bg-[#B3CFF3] hover:-translate-y-1 transition-transform duration-300">
                <div className="text-[10px] font-extrabold text-[#3B3633] mb-3 uppercase tracking-widest bg-white/40 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Physics II</div>
                <h4 className="text-xl font-extrabold text-[#3B3633] mb-3 tracking-tight">Electromagnetism Final Review</h4>
                <p className="text-[#3B3633]/70 text-sm mb-6 leading-relaxed font-bold">Key formulas, visualization of vector fields, and solved exam examples.</p>
                <div className="flex items-center justify-between text-sm pt-5 border-t border-[#3B3633]/10">
                  <span className="font-bold text-[#3B3633]">By Alex Chen</span>
                  <span className="text-[#3B3633]/50 font-bold text-xs">5 hrs ago</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="flex flex-col space-y-4 animate-fade-in-up ">
              <div className="flex items-center justify-between p-6 bg-white rounded-[2rem]  cursor-pointer border border-[#EBDDD0] shadow-sm">
                <div className="flex items-center space-x-5 hover:bg-white/80 transition-colors">
                  <div className="w-14 h-14 bg-[#D1BCFA] text-[#3B3633] rounded-2xl flex items-center justify-center text-2xl shadow-inner">⚙️</div>
                  <div>
                    <h4 className="font-extrabold text-[#3B3633] text-lg tracking-tight">Engineering Mechanics Finals Prep</h4>
                    <p className="text-xs text-[#3B3633]/60 mt-1 font-bold">Focusing on statics and rigid body equilibrium. Term Exam review.</p>
                  </div>
                </div>
                <button className="text-[#3B3633] font-extrabold text-sm px-6 py-2.5 rounded-xl bg-[#EBDDD0]/50 hover:bg-[#EBDDD0] transition-colors">Join Group</button>
              </div>
              <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] cursor-pointer border border-[#EBDDD0] shadow-sm ">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-[#F4B7CC] text-[#3B3633] rounded-2xl flex items-center justify-center text-2xl shadow-inner">💻</div>
                  <div>
                    <h4 className="font-extrabold text-[#3B3633] text-lg tracking-tight">Java & JavaFX Devs</h4>
                    <p className="text-xs text-[#3B3633]/60 mt-1 font-bold">Collaborating on advanced desktop application projects with FXML.</p>
                  </div>
                </div>
                <button className="text-[#3B3633] font-extrabold text-sm px-6 py-2.5 rounded-xl bg-[#EBDDD0]/50 hover:bg-[#EBDDD0] transition-colors">Join Group</button>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="animate-fade-in-up space-y-4">
              <div className="flex items-center justify-between p-6 border border-[#EBDDD0] rounded-[2rem] bg-white shadow-sm">
                <div className="flex items-center space-x-5">
                  <span className="text-2xl font-extrabold text-[#3B3633] w-6 text-center">1</span>
                  <div className="w-12 h-12 bg-[#F6DEBA] rounded-2xl flex items-center justify-center text-[#3B3633] font-extrabold shadow-sm">FI</div>
                  <span className="font-extrabold text-[#3B3633] text-lg">Fabiha Ishrah</span>
                </div>
                <span className="bg-[#EBDDD0]/50 text-[#3B3633] py-2 px-5 rounded-xl text-xs font-extrabold">1,240 pts</span>
              </div>
              <div className="flex items-center justify-between p-6 border border-[#EBDDD0] rounded-[2rem] bg-white shadow-sm">
                <div className="flex items-center space-x-5">
                  <span className="text-2xl font-extrabold text-[#3B3633]/40 w-6 text-center">2</span>
                  <div className="w-12 h-12 bg-[#D1BCFA] rounded-2xl flex items-center justify-center text-[#3B3633] font-extrabold shadow-sm">AC</div>
                  <span className="font-extrabold text-[#3B3633] text-lg">Alex Chen</span>
                </div>
                <span className="bg-[#EBDDD0]/50 text-[#3B3633] py-2 px-5 rounded-xl text-xs font-extrabold">985 pts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const TrendingResources = () => {
  const [votes, setVotes] = useState({ resource1: 124, resource2: 89 });

  const handleVote = (id) => {
    setVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto mt-6">
      <h2 className="text-3xl font-extrabold text-[#3B3633] mb-10 text-center tracking-tight">Trending Shared Resources</h2>
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Resource Card 1 */}
        <div className="flex bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] p-8 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex flex-col items-center mr-8 pt-1">
            <button onClick={() => handleVote('resource1')} className="text-[#3B3633]/30 hover:text-[#D1BCFA] transition transform hover:scale-125 text-3xl">
              ▲
            </button>
            <span className="font-extrabold text-xl text-[#3B3633] my-2.5">{votes.resource1}</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#3B3633] mb-3 cursor-pointer hover:opacity-70 transition tracking-tight">Complete Graph Theory Guide</h3>
            <p className="text-[#3B3633]/70 text-sm mb-6 leading-relaxed font-bold">Includes traversal algorithms, shortest path, spanning trees, and network flow examples.</p>
            <div className="flex space-x-2.5">
              <span className="bg-[#D1BCFA] text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider shadow-sm">Algorithms</span>
              <span className="bg-[#B3CFF3] text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider shadow-sm">PDF Notes</span>
            </div>
          </div>
        </div>

        {/* Resource Card 2 */}
        <div className="flex bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] p-8 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex flex-col items-center mr-8 pt-1">
            <button onClick={() => handleVote('resource2')} className="text-[#3B3633]/30 hover:text-[#F4B7CC] transition transform hover:scale-125 text-3xl">
              ▲
            </button>
            <span className="font-extrabold text-xl text-[#3B3633] my-2.5">{votes.resource2}</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#3B3633] mb-3 cursor-pointer hover:opacity-70 transition tracking-tight">UI Design with FXML</h3>
            <p className="text-[#3B3633]/70 text-sm mb-6 leading-relaxed font-bold">Best practices for linking frontend JavaFX components seamlessly using FXML and controllers.</p>
            <div className="flex space-x-2.5">
              <span className="bg-[#F6DEBA] text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider shadow-sm">Frontend</span>
              <span className="bg-[#F4B7CC] text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider shadow-sm">Code Snippet</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#FAF7F2] py-16 px-6 mt-20 border-t border-[#EBDDD0]">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-medium">
      <div className="mb-6 md:mb-0">
        <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-[#3B3633] rounded-full shadow-sm"></div>
            <span className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</span>
        </div>
        <p className="text-[#3B3633]/50 mt-3 text-xs font-extrabold uppercase tracking-wider">Connecting students to share, learn, and excel together.</p>
      </div>
      <div className="flex space-x-7 text-[#3B3633]/50 font-extrabold text-xs uppercase tracking-wider">
        <a href="#" className="hover:text-[#3B3633] transition-colors">About</a>
        <a href="#" className="hover:text-[#3B3633] transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-[#3B3633] transition-colors">Terms</a>
      </div>
    </div>
    <div className="max-w-6xl mx-auto flex justify-center text-[11px] text-[#3B3633]/40 mt-10 font-extrabold tracking-widest uppercase">
      &copy; {new Date().getFullYear()} StudyHub. All rights reserved.
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="font-sans text-[#3B3633] bg-[#EBDDD0] min-h-screen">
      <Navbar />
      <HeroSection />
      <InteractiveDashboard />
      <TrendingResources />
      <Footer />
    </div>
  );
}