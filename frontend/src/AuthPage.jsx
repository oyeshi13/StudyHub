import React, { useState, useEffect } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '' // Default value
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [departments,setDepartments] = useState([])

  // Toggle mode & clear inputs
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' });
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler connected to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    setLoading(true);

    const url = isLogin 
      ? 'http://127.0.0.1:5000/api/auth/login' 
      : 'http://127.0.0.1:5000/api/auth/register';
    
    
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password
        }
      : {
          student_id: parseInt(formData.student_id),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Success!' });

        if (isLogin) {
          
          localStorage.setItem('student', JSON.stringify(data.student));
          
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          
          setTimeout(() => {
            setIsLogin(true);
            setMessage({ type: 'success', text: 'Registration successful! Please login.' });
          }, 1500);
        }
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Server error occurred' });
      }
    } catch (err) {
      console.error("Fetch Error Detail:", err);
      setMessage({ type: 'error', text: 'Network Error: Check console for details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadDepartments = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:5000/getAllDept`);
      const fetchedDepartments = await response.json();

      console.log(fetchedDepartments);
      setDepartments(fetchedDepartments);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  loadDepartments();
}, []);
  return (
    <div className="min-h-screen bg-[#EBDDD0] flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="max-w-5xl w-full bg-[#FAF7F2] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/50">
        
        {/* Left Side: Form Section */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-10">
            <div className="flex items-center space-x-1 p-1.5 bg-[#F6DEBA] rounded-xl shadow-sm">
              <div className="w-3 h-3 bg-[#3B3633] rounded-full"></div>
              <div className="w-4 h-4 border-2 border-[#D1BCFA] rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-[#3B3633] rounded-full"></div>
              </div>
              <div className="w-3 h-3 bg-[#B3CFF3] rounded-full"></div>
            </div>
            <span className="text-xl font-extrabold text-[#3B3633]">
              StudyHub
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#3B3633] mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-[#3B3633]/60 text-sm mb-6 font-medium">
            {isLogin 
              ? 'Enter your details to access your study groups and resources.' 
              : 'Join thousands of students sharing notes and solving problems.'}
          </p>

          {/* Feedback Message */}
          {message.text && (
            <div className={`p-3.5 mb-4 rounded-2xl text-xs font-bold text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Student ID Field for Registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-[#3B3633] mb-1.5">Student ID</label>
                <input 
                  type="number" 
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="e.g. 2105001" 
                  className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                  required
                />
              </div>
            )}

            {/* Conditional Name Field */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-[#3B3633] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tamanna Haque" 
                  className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-[#3B3633] mb-1.5">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@university.edu" 
                className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                required
              />
            </div>

            {/* Department Dropdown for Registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-[#3B3633] mb-1.5">Department</label>
                  <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                  required
                  >
                  <option value="" disabled>Select department</option>

                  {departments.map(d => (
                  <option key={d.dept_name} value={d.dept_name}>
                    {d.dept_name}
                  </option>
                ))}
                </select>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-[#3B3633]">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs font-bold text-[#3B3633]/60 hover:text-[#3B3633] transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                required
              />
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-[#3B3633] mb-1.5">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full px-4 py-3.5 rounded-2xl border-none focus:ring-4 focus:ring-[#D1BCFA]/50 outline-none transition-all bg-[#EBDDD0]/50 focus:bg-white text-sm text-[#3B3633]"
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#262423] hover:bg-black disabled:bg-gray-400 text-[#FAF7F2] font-bold py-4 rounded-2xl shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-[#3B3633]/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              className="text-[#3B3633] font-bold hover:opacity-70 transition-opacity"
            >
              {isLogin ? 'Sign up for free' : 'Log in here'}
            </button>
          </div>
        </div>

        {/* Right Side: Branding Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#F6DEBA] via-[#F4B7CC] to-[#D1BCFA] p-12 text-[#3B3633] flex-col justify-between relative overflow-hidden rounded-r-[2.5rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-40 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

          <div className="relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
              New Feature
            </span>
            <h3 className="text-3xl font-extrabold mb-4 leading-tight tracking-tight">
              Join collaborative <br /> study groups.
            </h3>
            <p className="text-[#3B3633]/80 text-sm leading-relaxed max-w-sm font-medium">
              Connect your academic resources with the PERN stack architecture. Upload PDFs, share code snippets, and build your reputation.
            </p>
          </div>

          <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-xl shadow-black/5">
            <div className="flex text-[#3B3633] mb-3 text-sm">
              ★★★★★
            </div>
            <p className="text-sm font-bold text-[#3B3633] mb-5 leading-relaxed">
              "The shared resources here saved me during my term finals. I finally wrapped my head around complex concepts just in time, all thanks to the peer-reviewed notes!"
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#B3CFF3] flex items-center justify-center font-extrabold text-[#3B3633] shadow-inner">
                S
              </div>
              <div>
                <h4 className="text-sm font-extrabold">Sarah Jenkins</h4>
                <p className="text-[11px] text-[#3B3633]/70 font-bold uppercase tracking-wider mt-0.5">Computer Science Major</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}