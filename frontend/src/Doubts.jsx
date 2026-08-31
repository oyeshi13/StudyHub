import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doubtService } from './services/doubtService';

export default function Doubts() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data State
  const [courses, setCourses] = useState([]);
  const [doubts, setDoubts] = useState([]);
  
  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('All Courses');
  const [sortBy, setSortBy] = useState('Newest');

  // Form State
  const [isAsking, setIsAsking] = useState(false);
  const [formData, setFormData] = useState({ courseId: '', title: '', description: '', tags: '' });

  // Fetch Data on Load or Filter Change
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        //const [fetchedCourses, fetchedDoubts]
        const response = await fetch(`http://localhost:5000/doubts/courses`)
        const fetchedCourses = await response.json();
        console.log(fetchedCourses)
        setCourses(fetchedCourses);
        setError(null);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Adding slight debounce for search
    const timer = setTimeout(() => loadCourses(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCourseId, sortBy]);


  useEffect(() => {
    const loadDoubts = async () => {
      try {
        setLoading(true);
        const response =  await fetch(`http://localhost:5000/doubts/courses/getDoubts`)
        const fetchedDoubts = await response.json();
        setDoubts(fetchedDoubts);
        setError(null)
      } catch (err) {
        setError("Failed to load doubts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    // Adding slight debounce for search
    const timer = setTimeout(() => loadDoubts(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCourseId, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.title || !formData.description) return;
    
    try {
      setLoading(true);
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      //await doubtService.createDoubt({ ...formData, tags: tagsArray });

      await fetch("http://localhost:5000/doubts/post-doubt",{
        method: "POST",
        body : JSON.stringify({
          
        })
      })
      
      // Reload feed
      const updatedDoubts = await doubtService.getDoubts({ search: searchQuery, courseId: selectedCourseId, sort: sortBy });
      setDoubts(updatedDoubts);
      
      setFormData({ courseId: '', title: '', description: '', tags: '' });
      setIsAsking(false);
    } catch (err) {
      setError("Failed to post doubt.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    const hours = Math.floor(Math.abs(new Date() - new Date(isoString)) / 36e5);
    if(hours < 1) return "Just now";
    if(hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours/24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Navbar - Kept consistent with Dashboard */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EBDDD0] px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsMenuOpen(true)} className="p-2.5 rounded-xl text-[#3B3633]/70 hover:bg-[#EBDDD0]/50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="text-xl font-extrabold text-[#3B3633] tracking-tight hidden sm:block">StudyHub</div>
        </div>
        <div className="flex items-center space-x-5">
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-[#B3CFF3] shadow-sm flex items-center justify-center text-[#3B3633] font-extrabold text-sm cursor-pointer border border-white/50">ME</Link>
        </div>
      </nav>

      {/* Sidebar */}
      {isMenuOpen && <div className="fixed inset-0 bg-[#3B3633]/10 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#FAF7F2] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#EBDDD0] flex items-center justify-between">
          <span className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl text-[#3B3633]/50 hover:bg-[#EBDDD0]/50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <Link to="/dashboard" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 font-extrabold transition-colors"><span className="text-xl">🏠</span> <span>Home Feed</span></Link>
          <Link to="/groups" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 font-extrabold transition-colors"><span className="text-xl">🤝</span> <span>My Groups</span></Link>
          <Link to="/doubts" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl bg-[#EBDDD0]/50 text-[#3B3633] font-extrabold"><span className="text-xl">❓</span> <span>Doubts & Q&A</span></Link>
          <Link to="/profile" className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-[#3B3633]/60 hover:bg-[#EBDDD0]/30 hover:text-[#3B3633] font-extrabold transition-colors"><span className="text-xl">👤</span> <span>Profile</span></Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto pt-8 px-4 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#FAF7F2] p-8 rounded-[2.5rem] shadow-sm border border-[#EBDDD0] mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#3B3633]">Doubts & Q&A</h1>
            <p className="text-[#3B3633]/60 font-bold mt-2 text-sm max-w-sm">Ask questions, share your knowledge, and help fellow students understand difficult concepts.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <button onClick={() => setIsAsking(!isAsking)} className="w-full md:w-auto bg-[#262423] hover:bg-black text-[#FAF7F2] font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5">
              {isAsking ? 'Cancel' : '+ Ask a Doubt'}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && <div className="bg-[#F4B7CC]/20 border border-[#F4B7CC]/50 text-[#3B3633] font-bold px-4 py-3 rounded-xl mb-6">{error}</div>}

        {/* Ask Form Modal/Inline */}
        {isAsking && (
          <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-8 rounded-[2.5rem] shadow-sm border border-[#EBDDD0] mb-8 animate-fade-in-up">
            <h2 className="text-2xl font-extrabold text-[#3B3633] mb-6 tracking-tight">Post a New Doubt</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Course <span className="text-[#F4B7CC]">*</span></label>
                <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 text-sm font-bold text-[#3B3633] cursor-pointer">
                  <option value="" disabled>Select Course</option>
                  {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_title} — {c.course_code}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Doubt Title <span className="text-[#F4B7CC]">*</span></label>
                <input type="text" required placeholder="What are you struggling with?" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 text-sm font-bold text-[#3B3633]" />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Description <span className="text-[#F4B7CC]">*</span></label>
                <textarea required rows="4" placeholder="Explain your doubt in detail..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 text-sm font-bold text-[#3B3633] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Tags (Optional)</label>
                <input type="text" placeholder="e.g. Dijkstra, Graph, Algorithms" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 text-sm font-bold text-[#3B3633]" />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#EBDDD0]">
              <button type="button" className="flex items-center space-x-2 text-xs font-extrabold text-[#3B3633]/50 hover:text-[#3B3633] hover:bg-[#EBDDD0]/50 px-4 py-2 rounded-xl transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span>Attach File / PDF</span>
              </button>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsAsking(false)} className="px-6 py-2.5 rounded-xl font-extrabold text-sm shadow-sm bg-white border border-[#EBDDD0] hover:bg-[#EBDDD0]/50 text-[#3B3633] transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#262423] hover:bg-black text-[#FAF7F2] font-extrabold py-2.5 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-sm">Post Doubt</button>
              </div>
            </div>
          </form>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in-up">
          <div className="w-full flex flex-col md:flex-row gap-3">
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm cursor-pointer md:w-1/4">
              <option value="All Courses">All Courses</option>
              {courses.map(c => <option key={c.course_code} value={c.course_code}>{c.course_title}</option>)}
            </select>
            
            <div className="relative flex-1">
              <input type="text" placeholder="Search doubts, topics, or questions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm placeholder-[#3B3633]/40" />
              <svg className="w-4 h-4 text-[#3B3633]/40 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm cursor-pointer md:w-1/4">
              <option value="Newest">Newest</option>
              <option value="Most Reacted">Most Reacted</option>
              <option value="Most Answered">Most Answered</option>
              <option value="Unanswered">Unanswered</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Feed */}
        {loading ? (
           <div className="text-center py-10 text-[#3B3633]/50 font-bold">Loading doubts...</div>
        ) : doubts.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-[2rem] border border-[#EBDDD0] p-10 text-center animate-fade-in-up">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-extrabold text-[#3B3633] mb-2">No doubts found</h3>
            <p className="text-[#3B3633]/60 font-bold text-sm mb-6">Couldn't find any doubts matching your search or filter.</p>
            <button onClick={() => setIsAsking(true)} className="bg-[#262423] text-[#FAF7F2] px-6 py-2 rounded-xl font-bold text-sm shadow-sm">Ask the First Doubt</button>
          </div>
        ) : (
          <div>
            {doubts.map(doubt => (
              <div key={doubt.id} className="bg-[#FAF7F2] rounded-[2rem] shadow-sm border border-[#EBDDD0] p-6 mb-6 hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#D1BCFA] text-[#3B3633] flex items-center justify-center font-extrabold text-sm shadow-inner">
                      {doubt.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#3B3633] text-sm">{doubt.authorName}</h4>
                      <div className="flex items-center text-[11px] text-[#3B3633]/50 space-x-1.5 mt-0.5 font-bold uppercase tracking-wide">
                        <span className="bg-[#B3CFF3] text-[#3B3633] px-2 py-0.5 rounded-md font-extrabold">{doubt.courseCode}</span>
                        <span>•</span>
                        <span>{formatTime(doubt.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="text-lg font-extrabold text-[#3B3633] mb-2 tracking-tight">{doubt.title}</h3>
                  <p className="text-[#3B3633]/70 text-sm leading-relaxed font-bold line-clamp-2">{doubt.description}</p>
                  {doubt.tags && doubt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {doubt.tags.map((tag, idx) => (
                        <span key={idx} className="bg-[#EBDDD0]/50 text-[#3B3633] text-[10px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#EBDDD0] pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-[#3B3633]/60 font-bold text-sm">
                      <span className="text-[#F6DEBA] text-lg">⬆</span> <span>{doubt.reactionCount} reactions</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#3B3633]/60 font-bold text-sm">
                      <span className="text-lg">💬</span> <span>{doubt.answerCount} answers</span>
                    </div>
                  </div>
                  <Link to={`/doubts/${doubt.id}`} className="text-[#3B3633] font-extrabold text-sm hover:opacity-70 transition-opacity flex items-center space-x-1">
                    <span>View Doubt</span> <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}