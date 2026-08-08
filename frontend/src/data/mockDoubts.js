export const mockDoubts = [
  {
    id: "doubt-001",
    authorId: "user-001",
    authorName: "Fabiha Ishrah",
    courseId: "CSE-220",
    title: "Why can't Dijkstra's algorithm handle negative edges?",
    description: "I understand the basic implementation using a priority queue, but I'm confused about why a negative edge can break the algorithm. Can someone provide a simple graph example where it fails and explain the intuition?",
    tags: ["Dijkstra", "Graphs", "Algorithms"],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    reactionCount: 42,
    answerCount: 2
  },
  {
    id: "doubt-002",
    authorId: "user-003",
    authorName: "Rahim Hasan",
    courseId: "CSE-230",
    title: "BCNF vs 3NF - How to identify them quickly?",
    description: "During exams, I spend too much time figuring out if a relation is in 3NF or BCNF. What is the fastest way to check the dependency rules?",
    tags: ["DBMS", "Normalization"],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reactionCount: 15,
    answerCount: 0
  }
];