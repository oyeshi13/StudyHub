import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const CoursePost = ({ author, course, title, time, content, initialVotes, tags, commentsCount, fileUrl }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [voteStatus, setVoteStatus] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
            {author ? author.charAt(0) : 'U'}
          </div>
          <div>
            <h4 className="font-extrabold text-[#3B3633] text-sm">{author || 'Anonymous'}</h4>
            <div className="flex items-center text-xs text-[#3B3633]/50 space-x-1.5 mt-1 font-bold">
              {course && (
                <>
                  <span className="bg-[#B3CFF3] text-[#3B3633] text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider">{course}</span>
                  <span>•</span>
                </>
              )}
              <span>{time}</span>
            </div>
          </div>
        </div>
        
        <button className="text-[#3B3633]/40 hover:text-[#3B3633] p-1.5 rounded-xl hover:bg-[#EBDDD0]/50 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-xl font-extrabold text-[#3B3633] mb-2 tracking-tight">{title}</h3>
        <p className="text-[#3B3633]/80 text-sm leading-relaxed whitespace-pre-wrap font-bold">{content}</p>
        
        {fileUrl && fileUrl !== 'N/A' && (
          <div className="mt-4">
            <a 
              href={`http://localhost:5000${fileUrl}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-[#EBDDD0]/50 hover:bg-[#EBDDD0] text-[#3B3633] text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors border border-[#3B3633]/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>View Attachment</span>
            </a>
          </div>
        )}

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
          <button onClick={handleUpvote} className={`p-1.5 rounded-xl transition-colors flex items-center justify-center ${voteStatus === 'up' ? 'text-[#3B3633] bg-[#F6DEBA]' : 'text-[#3B3633]/40 hover:bg-white hover:text-[#3B3633]'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
          </button>
          <span className={`font-extrabold text-sm px-2 ${voteStatus === 'up' ? 'text-[#3B3633]' : voteStatus === 'down' ? 'text-[#F4B7CC]' : 'text-[#3B3633]/80'}`}>{votes}</span>
          <button onClick={handleDownvote} className={`p-1.5 rounded-xl transition-colors flex items-center justify-center ${voteStatus === 'down' ? 'text-[#3B3633] bg-[#F4B7CC]' : 'text-[#3B3633]/40 hover:bg-white hover:text-[#F4B7CC]'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        <button className="flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] transition-colors px-4 py-2 rounded-xl hover:bg-[#EBDDD0]/50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-sm font-extrabold hidden sm:inline">{commentsCount} Comments</span>
        </button>

        <button onClick={() => setIsBookmarked(!isBookmarked)} className={`flex items-center space-x-2 transition-colors px-4 py-2 rounded-xl hover:bg-[#EBDDD0]/50 ${isBookmarked ? 'text-[#3B3633]' : 'text-[#3B3633]/60 hover:text-[#3B3633]'}`}>
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <span className="text-sm font-extrabold hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default function GroupPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filter/Sort State
  const [activeCourse, setActiveCourse] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  
  // Create Post State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostData, setNewPostData] = useState({ course: '', title: '', content: '', tags: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDept = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/dept/${departmentId}`);
        const data = await response.json();
        setDepartment(data[0]);
      } catch (error) {
        console.log("Failed to fetch departments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDept();
  }, [departmentId]);

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/groups/posts/${departmentId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [departmentId]);

  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/groups/courses/${departmentId}`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.log("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [departmentId]);

  if (!department) {
    return <div className="min-h-screen bg-[#EBDDD0] flex items-center justify-center font-extrabold text-[#3B3633] text-2xl">Department Not Found</div>;
  }

  // Handle Post Creation with FormData
 const submitPost = async () => {
    if (!newPostData.title || !newPostData.content) {
      alert("Title and Content are required!");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const studentId = storedUser?.student_id || 2405172;

    try {
      const formData = new FormData();
      formData.append('title', newPostData.title);
      formData.append('description', newPostData.content);
      formData.append('student_id', studentId);
      formData.append('course_code', newPostData.course || '');
      
      // ফাইল সিলেক্ট করা থাকলে তবেই যাবে
      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      // এখানে কোনো headers দেওয়া যাবে না!
      const response = await fetch(`http://localhost:5000/groups/posts/${departmentId}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const refreshResponse = await fetch(`http://localhost:5000/groups/posts/${departmentId}`);
        const freshData = await refreshResponse.json();
        setPosts(freshData);

        setNewPostData({ course: '', title: '', content: '', tags: '' });
        setSelectedFile(null);
        setIsCreatingPost(false);
      } else {
        const errText = await response.text();
        console.error("Server Error:", errText);
        alert("Server error: " + errText);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Filter and Sort Logic
  let displayPosts = [...posts];

  if (activeCourse !== 'All Courses') {
    displayPosts = displayPosts.filter(p => (p.course || p.course_code) === activeCourse);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    displayPosts = displayPosts.filter(p => 
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q) ||
      (p.course && p.course.toLowerCase().includes(q)) ||
      (p.course_code && p.course_code.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (sortBy === 'Newest') displayPosts.sort((a,b) => new Date(b.createdAt || b.uploaded_at) - new Date(a.createdAt || a.uploaded_at));
  if (sortBy === 'Oldest') displayPosts.sort((a,b) => new Date(a.createdAt || a.uploaded_at) - new Date(b.createdAt || b.uploaded_at));
  if (sortBy === 'Most Reacted') displayPosts.sort((a,b) => (b.initialVotes || 0) - (a.initialVotes || 0));
  if (sortBy === 'Most Commented') displayPosts.sort((a,b) => (b.commentsCount || 0) - (a.commentsCount || 0));

  const formatTime = (isoString) => {
    const hours = Math.floor(Math.abs(new Date() - new Date(isoString)) / 36e5);
    if(hours < 1) return "Just now";
    if(hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours/24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Navbar */}
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

      {/* Sidebar */}
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
        </div>
      </div>

      <main className="max-w-3xl mx-auto pt-8 px-4 pb-20">
        {/* GROUP HEADER */}
        <div className="bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] p-8 mb-8 relative overflow-hidden animate-fade-in-up">
          <button onClick={() => navigate('/groups')} className="flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] font-extrabold text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Back to Groups</span>
          </button>
          <p className="mt-6 text-[#3B3633]/80 text-sm leading-relaxed font-bold max-w-2xl">Welcome to {department.dept_name}</p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in-up">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
            <select 
              value={activeCourse} 
              onChange={(e) => setActiveCourse(e.target.value)}
              className="bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm appearance-none cursor-pointer"
            >
              <option value="All Courses">All Courses</option>
              {courses.map((course, idx) => {
                const val = course.course_code || course.course || course.code;
                return <option key={val || idx} value={val}>{val}</option>;
              })}
            </select>

            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm placeholder-[#3B3633]/40"
              />
              <svg className="w-4 h-4 text-[#3B3633]/40 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-[#EBDDD0] text-[#3B3633] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1BCFA]/50 shadow-sm appearance-none cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Most Reacted">Most Reacted</option>
              <option value="Most Commented">Most Commented</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>

          <button 
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="w-full md:w-auto bg-[#262423] hover:bg-black text-[#FAF7F2] font-bold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isCreatingPost ? 'Cancel' : '+ New Post'}
          </button>
        </div>

        {/* CREATE POST FORM */}
        {isCreatingPost && (
          <div className="bg-[#FAF7F2] rounded-[2rem] shadow-sm border border-[#EBDDD0] p-6 mb-8 animate-fade-in-up">
            <h3 className="text-lg font-extrabold text-[#3B3633] mb-4 tracking-tight">Create a New Post</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Select Course</label>
                <select 
                  value={newPostData.course} 
                  onChange={(e) => setNewPostData({...newPostData, course: e.target.value})}
                  className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 focus:bg-white transition-all text-sm font-bold text-[#3B3633]"
                >
                  <option value="">Choose a {department.dept_name} course...</option>
                  {courses.map((c, idx) => {
                    const val = c.course_code || c.course || c.code;
                    return <option key={val || idx} value={val}>{val}</option>;
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Title <span className="text-[#F4B7CC]">*</span></label>
                <input 
                  type="text" 
                  placeholder="What's your question or discussion about?" 
                  value={newPostData.title}
                  onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                  className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 focus:bg-white transition-all text-sm font-bold text-[#3B3633] placeholder-[#3B3633]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Content <span className="text-[#F4B7CC]">*</span></label>
                <textarea 
                  rows="4" 
                  placeholder="Share your question, resource, discussion, or problem..."
                  value={newPostData.content}
                  onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                  className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 focus:bg-white transition-all resize-none text-sm font-bold text-[#3B3633] placeholder-[#3B3633]/40"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Tags (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Help, DP, Assignment (Comma separated)" 
                  value={newPostData.tags}
                  onChange={(e) => setNewPostData({...newPostData, tags: e.target.value})}
                  className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 focus:bg-white transition-all text-sm font-bold text-[#3B3633] placeholder-[#3B3633]/40"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-5 border-t border-[#EBDDD0] gap-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  className="hidden" 
                />

                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center space-x-2 text-xs font-extrabold text-[#3B3633]/70 hover:text-[#3B3633] hover:bg-[#EBDDD0]/50 px-4 py-2.5 rounded-xl transition-colors border border-dashed border-[#3B3633]/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="max-w-[150px] truncate">{selectedFile ? selectedFile.name : 'Add Attachment'}</span>
                </button>

                {selectedFile && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedFile(null)} 
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3 w-full sm:w-auto justify-end">
                <button 
                  type="button"
                  onClick={() => {
                    setIsCreatingPost(false);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm shadow-sm bg-white border border-[#EBDDD0] hover:bg-[#EBDDD0]/50 text-[#3B3633] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={submitPost}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm shadow-sm transition-transform bg-[#262423] hover:bg-black text-[#FAF7F2] transform hover:-translate-y-0.5"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEED LOOP */}
        <div>
          {displayPosts.length > 0 ? displayPosts.map((post, idx) => (
            <div key={post.resource_id || post.id || idx} className="animate-fade-in-up">
              <CoursePost 
                author={post.author}
                course={post.course || post.course_code}
                title={post.title}
                time={formatTime(post.createdAt || post.uploaded_at || new Date())}
                content={post.description || post.content}
                fileUrl={post.file_url}
                initialVotes={post.initialVotes || 0}
                commentsCount={post.commentsCount || 0}
                tags={post.tags}
              />
            </div>
          )) : (
            <div className="bg-[#FAF7F2] rounded-[2rem] border border-[#EBDDD0] p-10 text-center animate-fade-in-up">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-extrabold text-[#3B3633] mb-2">No posts found</h3>
              <p className="text-[#3B3633]/60 font-bold text-sm">Be the first to share a resource or ask a question for this filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}