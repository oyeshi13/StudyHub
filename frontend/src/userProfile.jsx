import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  // 🟢 লোকাল স্টোরেজ থেকে লগইন/রেজিস্ট্রেশন করা ইউজারের ডেটা সরাসরি লোড করা
  const getInitialProfileData = () => {
    const savedUser = JSON.parse(localStorage.getItem('student') || localStorage.getItem('user') || '{}');
    const savedProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

    return {
      name: savedProfile.name || savedUser.name || 'Student Name',
      email: savedProfile.email || savedUser.email || 'student@university.edu',
      department: savedProfile.department || savedUser.department || 'CSE',
      semester: savedProfile.semester || '1st Year, 2nd Term',
      bio: savedProfile.bio || 'Passionate student exploring software engineering, algorithms, and full-stack development.',
      languages: savedProfile.languages || 'Bangla, English',
      courses: savedProfile.courses || 'Data Structures, C++, Java, Database Systems, Discrete Math',
    };
  };

  const [profileData, setProfileData] = useState(getInitialProfileData);
  const [editFormData, setEditFormData] = useState(getInitialProfileData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🟢 এডিট করা ডেটা লোকাল স্টোরেজে সংরক্ষণ করা
  const handleSave = () => {
    setProfileData(editFormData);
    localStorage.setItem('user_profile', JSON.stringify(editFormData));
    
    // মূল স্টুডেন্ট ও ইউজার অবজেক্টেও নাম ও ইমেইল আপডেট রাখা
    const savedStudent = JSON.parse(localStorage.getItem('student') || localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...savedStudent,
      name: editFormData.name,
      email: editFormData.email,
      department: editFormData.department
    };
    localStorage.setItem('student', JSON.stringify(updatedUser));
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8 font-sans text-[#3B3633]">
      
      {/* Back to Home Navigation */}
      <Link to="/dashboard" className="inline-flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] font-extrabold text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] overflow-hidden">
        
        {/* Profile Header Background */}
        <div className="h-40 bg-gradient-to-r from-[#F6DEBA] via-[#F4B7CC] to-[#D1BCFA] relative">
          <button 
            onClick={() => {
              if (isEditing) handleCancel();
              else {
                setEditFormData({ ...profileData });
                setIsEditing(true);
              }
            }}
            className="absolute top-6 right-6 bg-white/30 hover:bg-white/50 border border-white/50 backdrop-blur-md text-[#3B3633] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-sm"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Info Section */}
        <div className="px-10 pb-10 relative">
          
          {/* Avatar */}
          <div className="absolute -top-16 border-[6px] border-[#FAF7F2] w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-sm">
            🎓
          </div>

          <div className="pt-20">
            {!isEditing ? (
              // ==========================================
              // VIEW MODE
              // ==========================================
              <div className="animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#3B3633]">{profileData.name}</h1>
                  {profileData.department && (
                    <span className="bg-[#D1BCFA]/50 text-[#3B3633] text-xs font-extrabold px-3 py-1 rounded-full">
                      {profileData.department}
                    </span>
                  )}
                </div>
                <p className="text-[#3B3633]/60 font-extrabold mt-1 text-sm">{profileData.email}</p>

                <div className="mt-10 space-y-8">
                  <div>
                    <h3 className="text-[11px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest mb-3">About Me</h3>
                    <p className="text-[#3B3633]/80 leading-relaxed text-sm font-bold">{profileData.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-[#EBDDD0] shadow-sm">
                      <h3 className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest mb-1.5">Academic Level</h3>
                      <p className="font-extrabold text-[#3B3633] text-sm">{profileData.semester}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#EBDDD0] shadow-sm">
                      <h3 className="text-[10px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest mb-1.5">Languages</h3>
                      <p className="font-extrabold text-[#3B3633] text-sm">{profileData.languages}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-extrabold text-[#3B3633]/50 uppercase tracking-widest mb-4">Current Courses & Interests</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {profileData.courses && profileData.courses.split(',').map((course, index) => (
                        <span key={index} className="bg-[#B3CFF3] text-[#3B3633] px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                          {course.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ==========================================
              // EDIT MODE
              // ==========================================
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-extrabold text-[#3B3633] mb-8 tracking-tight">Edit Profile</h2>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white text-sm font-bold text-[#3B3633]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white text-sm font-bold text-[#3B3633]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Bio</label>
                    <textarea 
                      name="bio"
                      rows="3"
                      value={editFormData.bio}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white resize-none text-sm font-bold text-[#3B3633]"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Academic Level / Semester</label>
                      <input 
                        type="text" 
                        name="semester"
                        value={editFormData.semester}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white text-sm font-bold text-[#3B3633]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Languages</label>
                      <input 
                        type="text" 
                        name="languages"
                        value={editFormData.languages}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white text-sm font-bold text-[#3B3633]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#3B3633]/60 uppercase tracking-wider mb-2">Courses & Interests (Comma separated)</label>
                    <input 
                      type="text" 
                      name="courses"
                      value={editFormData.courses}
                      onChange={handleInputChange}
                      placeholder="e.g. React, Node.js, Calculus"
                      className="w-full px-5 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/40 focus:bg-white text-sm font-bold text-[#3B3633]"
                    />
                  </div>

                  <div className="flex space-x-4 pt-6 border-t border-[#EBDDD0]">
                    <button 
                      type="submit"
                      className="bg-[#262423] hover:bg-black text-[#FAF7F2] font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="bg-white border border-[#EBDDD0] hover:bg-[#EBDDD0]/50 text-[#3B3633] font-extrabold py-3.5 px-8 rounded-xl transition-colors text-sm shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}