export const mockAnswers = [
  {
    id: "answer-001",
    doubtId: "doubt-001",
    authorId: "user-002",
    authorName: "Alex Chen",
    content: "Because Dijkstra assumes that once a node has been selected with the smallest known distance, that distance cannot later become smaller. A negative edge completely breaks this greedy assumption. If you need to handle negative weights, you should look into the Bellman-Ford algorithm instead.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactionCount: 24,
    isAccepted: true
  },
  {
    id: "answer-002",
    doubtId: "doubt-001",
    authorId: "user-004",
    authorName: "Sarah Jenkins",
    content: "Adding to what Alex said, imagine a graph A -> B (weight 2), A -> C (weight 5), and C -> B (weight -10). Dijkstra will visit B via A first and lock in distance 2. It will never consider the path through C because it already 'finalized' B.",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    reactionCount: 12,
    isAccepted: false
  }
];