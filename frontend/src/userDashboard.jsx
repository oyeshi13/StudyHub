import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==========================================
// 1. REUSABLE POST COMPONENT
// ==========================================
const Post = ({ author, group, time, content, initialVotes, tags }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [voteStatus, setVoteStatus] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setVotes(votes - 1);
      setVoteStatus(null);
    } else {
      setVotes(voteStatus === 'down' ? votes + 2 : votes + 1);
      setVoteStatus('up');
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setVotes(votes + 1);
      setVoteStatus(null);
    } else {
      setVotes(voteStatus === 'up' ? votes - 2 : votes - 1);
      setVoteStatus('down');
    }
  };

  return (
    <div className="bg-[#FAF7F2] rounded-[2rem] shadow-sm border border-[#EBDDD0] p-6 mb-6">
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#D1BCFA] text-[#3B3633] flex items-center justify-center font-extrabold text-lg shadow-inner">
            {author.charAt(0)}
          </div>
          <div>
            <h4 className="font-extrabold text-[#3B3633] text-sm">{author}</h4>
            <div className="flex items-center text-xs text-[#3B3633]/50 space-x-1.5 mt-1 font-bold">
              {group && (
                <>
                  <span className="font-extrabold text-[#3B3633] hover:opacity-70 cursor-pointer">{group}</span>
                  <span>•</span>
                </>
              )}
              <span>{time}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-[#3B3633]/40 hover:text-[#3B3633] p-1.5 rounded-xl hover:bg-[#EBDDD0]/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-40 bg-[#FAF7F2] border border-[#EBDDD0] rounded-2xl shadow-lg z-10 overflow-hidden py-1">
              <button className="w-full text-left px-4 py-2.5 text-sm font-extrabold text-[#F4B7CC] hover:bg-[#EBDDD0]/50 flex items-center transition-colors">
                <span className="mr-2">🚩</span> Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[#3B3633]/80 text-sm leading-relaxed whitespace-pre-wrap font-bold">{content}</p>
        {tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-[#EBDDD0]/50 text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#EBDDD0] pt-4">
        <div className="flex items-center space-x-1 bg-[#EBDDD0]/30 rounded-2xl border border-[#EBDDD0] p-1.5">
          <button 
            onClick={handleUpvote}
            className={`p-1.5 rounded-xl transition-colors flex items-center justify-center ${voteStatus === 'up' ? 'text-[#3B3633] bg-[#F6DEBA]' : 'text-[#3B3633]/40 hover:bg-white hover:shadow-sm hover:text-[#3B3633]'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
          </button>
          <span className={`font-extrabold text-sm px-2 ${voteStatus === 'up' ? 'text-[#3B3633]' : voteStatus === 'down' ? 'text-[#F4B7CC]' : 'text-[#3B3633]/80'}`}>
            {votes}
          </span>
          <button 
            onClick={handleDownvote}
            className={`p-1.5 rounded-xl transition-colors flex items-center justify-center ${voteStatus === 'down' ? 'text-[#3B3633] bg-[#F4B7CC]' : 'text-[#3B3633]/40 hover:bg-white hover:shadow-sm hover:text-[#F4B7CC]'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        <button className="flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] transition-colors px-4 py-2 rounded-xl hover:bg-[#EBDDD0]/50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-sm font-extrabold hidden sm:inline">Comment</span>
        </button>

        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`flex items-center space-x-2 transition-colors px-4 py-2 rounded-xl hover:bg-[#EBDDD0]/50 ${isBookmarked ? 'text-[#3B3633]' : 'text-[#3B3633]/60 hover:text-[#3B3633]'}`}
        >
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <span className="text-sm font-extrabold hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN DASHBOARD COMPONENT
// ==========================================
export default function UserDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [postText, setPostText] = useState('');

  // 🟢 লগআউট হ্যান্ডলার
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('student');
    localStorage.removeItem('role');
    localStorage.removeItem('user_profile');
    navigate('/login');
  };

  const feedPosts = [
    {
      id: 1,
      author: 'Fabiha Ishrah',
      group: 'Data Structures & Algorithms',
      time: '2 hours ago',
      content: 'I have my DSA exams upcoming today! I want to share this quick guide I wrote on dynamic programming and graph theory. I tried learning it before and everything seemed very difficult to solve, but breaking down the base cases really helps.',
      initialVotes: 42,
      tags: ['DP', 'GraphTheory', 'ExamPrep']
    },
    {
      id: 2,
      author: 'Alex Chen',
      group: 'Engineering Mechanics',
      time: '5 hours ago',
      content: 'Can someone explain the rigid body equilibrium equations for this assignment? I have my term finals coming and I have only one day to review the mechanical syllabus. Specifically struggling with structural joints.',
      initialVotes: 15,
      tags: ['Statics', 'Finals']
    },
    {
      id: 3,
      author: 'Sarah Jenkins',
      group: 'Mathematics Hub',
      time: '1 day ago',
      content: 'Just uploaded my notes on linear transformations in LA! It covers matrix properties, vector spaces, and a few solved examples from last week\'s lecture.',
      initialVotes: 128,
      tags: ['LinearAlgebra', 'Notes']
    }
  ];

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
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
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2.5 text-[#3B3633]/60 hover:bg-[#EBDDD0]/50 hover:text-[#3B3633] rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F4B7CC] rounded-full border-2 border-[#FAF7F2]"></span>
          </button>
          
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-[#B3CFF3] shadow-sm flex items-center justify-center text-[#3B3633] font-extrabold text-sm cursor-pointer border border-white/50 hover:opacity-90 transition-opacity">
            ME
          </Link>

          {/* 🟢 Top Navbar Logout Button */}
          <button 
            onClick={handleLogout}
            title="Logout"
            className="flex items-center space-x-1.5 bg-[#F4B7CC]/20 hover:bg-[#F4B7CC]/40 text-[#3B3633] font-extrabold px-3.5 py-2 rounded-xl text-xs transition-colors border border-[#F4B7CC]/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#3B3633]/10 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#EBDDD0] flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl text-[#3B3633]/50 hover:bg-[#EBDDD0]/50 hover:text-[#3B3633] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <Link to="/dashboard" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl bg-[#EBDDD0]/50 text-[#3B3633] font-extrabold">
            <span className="text-xl">🏠</span> <span>Home Feed</span>
          </Link>
          <Link to="/groups" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
            <span className="text-xl">🤝</span> <span>My Groups</span>
          </Link>
          <Link to="/doubts" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
            <span className="text-xl">❓</span> <span>Doubts & Q&A</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors">
            <span className="text-xl">👤</span> <span>Profile</span>
          </Link>
        </div>

        {/* 🟢 Sidebar Bottom Logout Button */}
        <div className="p-4 border-t border-[#EBDDD0]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-extrabold transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto pt-8 px-4 pb-20">
        <div>
          <h2 className="text-[11px] font-extrabold text-[#3B3633]/50 mb-5 uppercase tracking-widest pl-2">Your Feed</h2>
          {feedPosts.map((post) => (
            <Post 
              key={post.id}
              author={post.author}
              group={post.group}
              time={post.time}
              content={post.content}
              initialVotes={post.initialVotes}
              tags={post.tags}
            />
          ))}
        </div>
      </main>
    </div>
  );
}