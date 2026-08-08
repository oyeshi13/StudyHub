import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doubtService } from './services/doubtService';

export default function DoubtDetails() {
  const { doubtId } = useParams();
  const [doubt, setDoubt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Answer Form
  const [newAnswer, setNewAnswer] = useState("");
  // Reaction states to simulate UX visually
  const [reactedItems, setReactedItems] = useState({}); 

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const [fetchedDoubt, fetchedAnswers] = await Promise.all([
          doubtService.getDoubtById(doubtId),
          doubtService.getAnswersByDoubtId(doubtId)
        ]);
        setDoubt(fetchedDoubt);
        setAnswers(fetchedAnswers);
      } catch (err) {
        setError("Doubt not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [doubtId]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      const addedAnswer = await doubtService.createAnswer(doubtId, newAnswer);
      setAnswers([...answers, addedAnswer]);
      setDoubt({...doubt, answerCount: doubt.answerCount + 1});
      setNewAnswer("");
    } catch (err) {
      alert("Failed to post answer");
    }
  };

  const handleReactDoubt = async () => {
    if (reactedItems[doubtId]) return; // prevent spam
    try {
      const res = await doubtService.reactToDoubt(doubtId);
      setDoubt({...doubt, reactionCount: res.count});
      setReactedItems({...reactedItems, [doubtId]: true});
    } catch(err) { console.error(err); }
  };

  const handleReactAnswer = async (ansId) => {
    if (reactedItems[ansId]) return;
    try {
      const res = await doubtService.reactToAnswer(ansId);
      setAnswers(answers.map(a => a.id === ansId ? {...a, reactionCount: res.count} : a));
      setReactedItems({...reactedItems, [ansId]: true});
    } catch(err) { console.error(err); }
  };

  const handleAcceptAnswer = async (ansId) => {
    try {
      await doubtService.acceptAnswer(doubtId, ansId);
      // Reload answers to trigger re-sort
      const refreshedAnswers = await doubtService.getAnswersByDoubtId(doubtId);
      setAnswers(refreshedAnswers);
    } catch(err) { console.error(err); }
  };

  const formatTime = (iso) => {
    const hours = Math.floor(Math.abs(new Date() - new Date(iso)) / 36e5);
    return hours < 1 ? "Just now" : hours < 24 ? `${hours} hours ago` : `${Math.floor(hours/24)} days ago`;
  };

  if (loading) return <div className="min-h-screen bg-[#EBDDD0] flex items-center justify-center font-bold text-[#3B3633]">Loading...</div>;
  if (error || !doubt) return <div className="min-h-screen bg-[#EBDDD0] flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#EBDDD0] font-sans text-[#3B3633]">
      {/* Basic Nav */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EBDDD0] px-6 h-20 flex items-center justify-between shadow-sm">
        <Link to="/doubts" className="text-xl font-extrabold text-[#3B3633] tracking-tight">StudyHub Q&A</Link>
      </nav>

      <main className="max-w-3xl mx-auto pt-8 px-4 pb-20">
        <Link to="/doubts" className="inline-flex items-center space-x-2 text-[#3B3633]/60 hover:text-[#3B3633] font-extrabold text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>Back to Doubts</span>
        </Link>

        {/* The Doubt */}
        <div className="bg-[#FAF7F2] rounded-[2rem] shadow-sm border border-[#EBDDD0] p-8 mb-8 animate-fade-in-up">
          <div className="flex items-center text-[11px] text-[#3B3633]/60 space-x-1.5 mb-5 font-bold uppercase tracking-widest">
            <span className="bg-[#B3CFF3] text-[#3B3633] px-2.5 py-1 rounded-md font-extrabold shadow-sm">{doubt.courseCode} — {doubt.courseName}</span>
          </div>
          
          <h1 className="text-2xl font-extrabold text-[#3B3633] mb-4 tracking-tight leading-tight">{doubt.title}</h1>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#D1BCFA] text-[#3B3633] flex items-center justify-center font-extrabold text-xs shadow-inner">
              {doubt.authorName.charAt(0)}
            </div>
            <div className="text-xs font-bold text-[#3B3633]/60">
              Posted by <span className="font-extrabold text-[#3B3633]">{doubt.authorName}</span> • {formatTime(doubt.createdAt)}
            </div>
          </div>

          <p className="text-[#3B3633]/80 text-[15px] leading-relaxed font-bold whitespace-pre-wrap mb-8">{doubt.description}</p>
          
          {doubt.tags && doubt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {doubt.tags.map((t, i) => <span key={i} className="bg-[#EBDDD0]/50 text-[#3B3633] text-[11px] px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wider">#{t}</span>)}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#EBDDD0] pt-5">
             <div className="flex items-center space-x-1 bg-[#EBDDD0]/30 rounded-2xl border border-[#EBDDD0] p-1.5">
               <button onClick={handleReactDoubt} className={`p-1.5 rounded-xl transition-colors flex items-center justify-center ${reactedItems[doubtId] ? 'bg-[#F6DEBA] text-[#3B3633]' : 'text-[#3B3633]/40 hover:bg-white hover:text-[#3B3633]'}`}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
               </button>
               <span className="font-extrabold text-sm px-2 text-[#3B3633]">{doubt.reactionCount}</span>
             </div>
             <span className="text-sm font-extrabold text-[#3B3633]/60">{doubt.answerCount} Answers</span>
          </div>
        </div>

        {/* Answers List */}
        <div className="mb-10">
          <h3 className="text-lg font-extrabold text-[#3B3633] mb-5 tracking-tight">{answers.length} Answers</h3>
          {answers.map(ans => (
            <div key={ans.id} className={`bg-[#FAF7F2] rounded-[2rem] shadow-sm border ${ans.isAccepted ? 'border-[#B3CFF3]' : 'border-[#EBDDD0]'} p-6 mb-4 animate-fade-in-up relative`}>
              {ans.isAccepted && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#B3CFF3] text-[#3B3633] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-white/50 flex items-center">
                  <span className="mr-1">✓</span> Accepted Answer
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F6DEBA] text-[#3B3633] flex items-center justify-center font-extrabold text-xs shadow-inner">
                    {ans.authorName.charAt(0)}
                  </div>
                  <div className="text-xs font-bold text-[#3B3633]/60">
                    <span className="font-extrabold text-[#3B3633]">{ans.authorName}</span> • {formatTime(ans.createdAt)}
                  </div>
                </div>
                {/* Accept Answer Action (Simulated as Doubt Author) */}
                {!ans.isAccepted && (
                  <button onClick={() => handleAcceptAnswer(ans.id)} className="text-[10px] text-[#3B3633]/40 hover:text-[#B3CFF3] font-extrabold uppercase tracking-wider transition-colors">
                    Mark Accepted
                  </button>
                )}
              </div>
              <p className="text-[#3B3633]/80 text-sm leading-relaxed font-bold whitespace-pre-wrap mb-5">{ans.content}</p>
              
              <div className="flex items-center space-x-4 border-t border-[#EBDDD0] pt-4">
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleReactAnswer(ans.id)} className={`text-lg transition-colors ${reactedItems[ans.id] ? 'text-[#F6DEBA]' : 'text-[#3B3633]/30 hover:text-[#3B3633]'}`}>⬆</button>
                  <span className="font-extrabold text-sm text-[#3B3633]">{ans.reactionCount}</span>
                </div>
                <button className="text-xs font-extrabold text-[#3B3633]/50 hover:text-[#3B3633] transition-colors">Reply</button>
              </div>
            </div>
          ))}
        </div>

        {/* Post Answer Form */}
        <form onSubmit={handlePostAnswer} className="bg-[#FAF7F2] rounded-[2.5rem] shadow-sm border border-[#EBDDD0] p-6 animate-fade-in-up">
          <h3 className="text-sm font-extrabold text-[#3B3633] mb-4 tracking-tight">Answer this doubt</h3>
          <textarea 
            rows="3" 
            required
            value={newAnswer}
            onChange={e => setNewAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full bg-[#EBDDD0]/40 border-none rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D1BCFA]/50 text-sm font-bold text-[#3B3633] resize-none mb-4"
          ></textarea>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#262423] hover:bg-black text-[#FAF7F2] font-extrabold py-2.5 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 text-sm">Post Answer</button>
          </div>
        </form>
      </main>
    </div>
  );
}