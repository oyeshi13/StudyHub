import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const [adminUser, setAdminUser] = useState(null);

  // ১. সেশন ডাটা এবং পেন্ডিং লিস্ট ফেচ
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (storedRole !== 'admin') {
      navigate('/login');
      return;
    }

    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }

    fetchPendingList();
  }, [navigate]);

  const fetchPendingList = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/pending-students');
      const data = await res.json();
      if (res.ok) {
        setPendingStudents(data);
      } else {
        setNotification({ type: 'error', text: data.message || 'Failed to fetch students' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Server connection failed' });
    } finally {
      setLoading(false);
    }
  };

  // ২. Approve হ্যান্ডলার
  const handleApprove = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/approve-student/${studentId}`, {
        method: 'PUT'
      });
      const data = await res.json();

      if (res.ok) {
        setNotification({ type: 'success', text: `Student ID ${studentId} approved successfully!` });
        setPendingStudents(prev => prev.filter(s => s.student_id !== studentId));
      } else {
        setNotification({ type: 'error', text: data.message || 'Approval failed' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Error executing approval request' });
    }
  };

  // ৩. সাইন আউট
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#EBDDD0] p-6 md:p-10 text-[#3B3633]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navbar */}
        <header className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-white/60 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 p-2 bg-[#F6DEBA] rounded-xl">
              <div className="w-2.5 h-2.5 bg-[#3B3633] rounded-full"></div>
              <div className="w-3.5 h-3.5 border-2 border-[#D1BCFA] rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-[#3B3633] rounded-full"></div>
              </div>
              <div className="w-2.5 h-2.5 bg-[#B3CFF3] rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">StudyHub Admin</h1>
              <p className="text-xs text-[#3B3633]/60 font-medium">Verification & Management Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{adminUser?.name || 'Administrator'}</p>
              <p className="text-xs text-[#3B3633]/60">{adminUser?.email || 'admin@portal.edu'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#262423] hover:bg-black text-[#FAF7F2] text-xs font-bold px-4 py-2.5 rounded-2xl transition shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-white/60 shadow-sm">
            <span className="text-xs font-bold text-[#3B3633]/60 uppercase tracking-wider">Pending Approvals</span>
            <p className="text-3xl font-black mt-2 text-[#3B3633]">{pendingStudents.length}</p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-white/60 shadow-sm">
            <span className="text-xs font-bold text-[#3B3633]/60 uppercase tracking-wider">System Role</span>
            <p className="text-3xl font-black mt-2 text-[#3B3633]">Super Admin</p>
          </div>
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-white/60 shadow-sm">
            <span className="text-xs font-bold text-[#3B3633]/60 uppercase tracking-wider">System State</span>
            <p className="text-3xl font-black mt-2 text-green-700">Online</p>
          </div>
        </div>

        {/* Alerts */}
        {notification.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold transition-all ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.text}
          </div>
        )}

        {/* Main Content: Pending Table */}
        <main className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border border-white/60 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Student Verification Queue</h2>
              <p className="text-xs text-[#3B3633]/60 font-medium mt-0.5">
                Review and approve newly registered student credentials.
              </p>
            </div>
            <button
              onClick={fetchPendingList}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white border border-[#3B3633]/10 hover:bg-gray-50 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm font-semibold text-[#3B3633]/50">
              Loading queue...
            </div>
          ) : pendingStudents.length === 0 ? (
            <div className="text-center py-14 bg-white/50 rounded-2xl border border-dashed border-[#3B3633]/20">
              <p className="font-bold text-sm">All caught up!</p>
              <p className="text-xs text-[#3B3633]/60 mt-1">There are no accounts pending approval.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3B3633]/10 text-[11px] font-bold text-[#3B3633]/50 uppercase tracking-wider">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3633]/5 text-sm font-medium">
                  {pendingStudents.map((student) => (
                    <tr key={student.student_id} className="hover:bg-white/60 transition">
                      <td className="py-3.5 px-4 font-bold">{student.student_id}</td>
                      <td className="py-3.5 px-4">{student.name}</td>
                      <td className="py-3.5 px-4 text-xs text-[#3B3633]/70">{student.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#EBDDD0]/80 text-[#3B3633]">
                          {student.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleApprove(student.student_id)}
                          className="bg-[#262423] hover:bg-black text-[#FAF7F2] px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}