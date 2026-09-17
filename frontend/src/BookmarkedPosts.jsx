import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function BookmarkedPosts() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookmarks/my-bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data);
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token, navigate]);

  const removeBookmark = async (resourceId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookmarks/toggle/${resourceId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBookmarks(prev => prev.filter(item => item.resource_id !== resourceId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EBDDD0] px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-xl text-[#3B3633]/70 hover:bg-[#EBDDD0]/50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</div>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-xl bg-[#B3CFF3] flex items-center justify-center font-extrabold text-sm border border-white/50">ME</Link>
      </nav>

      {/* Sidebar */}
      {isMenuOpen && <div className="fixed inset-0 bg-[#3B3633]/10 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#EBDDD0] flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#3B3633]">StudyHub</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl text-[#3B3633]/50 hover:bg-[#EBDDD0]/50">✕</button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5 font-extrabold">
          <Link to="/dashboard" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30"><span className="text-xl">🏠</span> <span>Home Feed</span></Link>
          <Link to="/groups" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30"><span className="text-xl">🤝</span> <span>My Groups</span></Link>
          <Link to="/doubts" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30"><span className="text-xl">❓</span> <span>Doubts & Q&A</span></Link>
          <Link to="/bookmarks" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl bg-[#EBDDD0]/50 text-[#3B3633]"><span className="text-xl">🔖</span> <span>Bookmarked</span></Link>
          <Link to="/profile" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30"><span className="text-xl">👤</span> <span>Profile</span></Link>
        </div>
        <div className="p-4 border-t border-[#EBDDD0]">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-extrabold"><span className="text-xl">🚪</span> <span>Logout</span></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pt-8 px-4 pb-20">
        <h2 className="text-xl font-extrabold mb-6 tracking-tight">🔖 Saved Posts</h2>

        {loading ? (
          <p className="text-center font-bold text-[#3B3633]/60">Loading bookmarks...</p>
        ) : bookmarks.length > 0 ? (
          bookmarks.map(post => (
            <div key={post.resource_id} className="bg-[#FAF7F2] rounded-[2rem] border border-[#EBDDD0] p-6 mb-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-extrabold text-[#3B3633] text-sm">{post.author}</h4>
                  <span className="text-xs text-[#3B3633]/50 font-bold">{post.group_name || 'General'}</span>
                </div>
                <button onClick={() => removeBookmark(post.resource_id)} className="text-xs font-bold text-red-500 hover:underline">Remove</button>
              </div>
              <h3 className="text-lg font-extrabold text-[#3B3633] mb-2">{post.title}</h3>
              <p className="text-[#3B3633]/80 text-sm font-bold whitespace-pre-wrap">{post.description}</p>
              {post.file_url && (
                <a href={`http://localhost:5000${post.file_url}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-extrabold text-blue-600 hover:underline">
                  View Attachment
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="bg-[#FAF7F2] rounded-[2rem] border border-[#EBDDD0] p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-base font-extrabold text-[#3B3633]">No bookmarked posts yet</h3>
            <p className="text-xs text-[#3B3633]/60 mt-1 font-bold">Posts you save will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}