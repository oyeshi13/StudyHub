import { mockCourses } from '../data/courses';
import { mockDoubts } from '../data/mockDoubts';
import { mockAnswers } from '../data/mockAnswers';

// In-memory data stores (simulating database state for the session)
let doubtsTable = [...mockDoubts];
let answersTable = [...mockAnswers];

export const doubtService = {
  // GET /api/courses
  getCourses: async () => {
    return Promise.resolve([...mockCourses]);
  },

  // GET /api/doubts?courseId=...&search=...&sort=...
  getDoubts: async (filters = {}) => {
    let results = [...doubtsTable];

    if (filters.courseId && filters.courseId !== 'All Courses') {
      results = results.filter(d => d.courseId === filters.courseId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.authorName.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.sort) {
      if (filters.sort === 'Newest') results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (filters.sort === 'Oldest') results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (filters.sort === 'Most Reacted') results.sort((a, b) => b.reactionCount - a.reactionCount);
      if (filters.sort === 'Most Answered') results.sort((a, b) => b.answerCount - a.answerCount);
      if (filters.sort === 'Unanswered') {
        results = results.filter(d => d.answerCount === 0);
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Join course name for frontend convenience
    const enrichedResults = results.map(doubt => {
      const course = mockCourses.find(c => c.id === doubt.courseId);
      return { ...doubt, courseName: course ? course.name : 'Unknown', courseCode: course ? course.code : 'Unknown' };
    });

    return Promise.resolve(enrichedResults);
  },

  // GET /api/doubts/:id
  getDoubtById: async (id) => {
    const doubt = doubtsTable.find(d => d.id === id);
    if (!doubt) throw new Error("Doubt not found");
    const course = mockCourses.find(c => c.id === doubt.courseId);
    return Promise.resolve({ ...doubt, courseName: course?.name, courseCode: course?.code });
  },

  // POST /api/doubts
  createDoubt: async (data) => {
    const newDoubt = {
      id: `doubt-${Date.now()}`,
      authorId: "me-001",
      authorName: "Current User",
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      reactionCount: 0,
      answerCount: 0
    };
    doubtsTable = [newDoubt, ...doubtsTable];
    return Promise.resolve(newDoubt);
  },

  // GET /api/doubts/:id/answers
  getAnswersByDoubtId: async (doubtId) => {
    const answers = answersTable.filter(a => a.doubtId === doubtId);
    answers.sort((a, b) => {
      if (a.isAccepted) return -1;
      if (b.isAccepted) return 1;
      return b.reactionCount - a.reactionCount; // Sort by reactions
    });
    return Promise.resolve([...answers]);
  },

  // POST /api/doubts/:id/answers
  createAnswer: async (doubtId, content) => {
    const newAnswer = {
      id: `answer-${Date.now()}`,
      doubtId: doubtId,
      authorId: "me-001",
      authorName: "Current User",
      content: content,
      createdAt: new Date().toISOString(),
      reactionCount: 0,
      isAccepted: false
    };
    answersTable = [...answersTable, newAnswer];
    
    // Increment answer count
    const doubtIndex = doubtsTable.findIndex(d => d.id === doubtId);
    if(doubtIndex > -1) doubtsTable[doubtIndex].answerCount += 1;

    return Promise.resolve(newAnswer);
  },

  // PATCH /api/doubts/:id/accepted-answer
  acceptAnswer: async (doubtId, answerId) => {
    answersTable = answersTable.map(a => {
      if (a.doubtId === doubtId) {
        return { ...a, isAccepted: a.id === answerId }; // Enforce only 1 accepted
      }
      return a;
    });
    return Promise.resolve({ success: true });
  },
  
  // POST /api/doubts/:id/react
  reactToDoubt: async (id) => {
    const doubtIndex = doubtsTable.findIndex(d => d.id === id);
    if(doubtIndex > -1) doubtsTable[doubtIndex].reactionCount += 1;
    return Promise.resolve({ success: true, count: doubtsTable[doubtIndex].reactionCount });
  },

  // POST /api/answers/:id/react
  reactToAnswer: async (id) => {
    const ansIndex = answersTable.findIndex(a => a.id === id);
    if(ansIndex > -1) answersTable[ansIndex].reactionCount += 1;
    return Promise.resolve({ success: true, count: answersTable[ansIndex].reactionCount });
  }
};