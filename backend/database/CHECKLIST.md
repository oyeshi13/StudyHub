# CSE216 Database Checklist

Run `npm run db:migrate:checklist` from `backend/` after configuring `backend/.env`. The migration is repeatable and runs inside a transaction.

- Authentication: the app issues its own JWTs from the auth controller. All API routes require a valid token except login, registration, the department list used by registration, health, and static uploads. Admin-only routes check the token role.
- Explicit transactions: registration and doubt posting use explicit `BEGIN`, `COMMIT`, and `ROLLBACK`. Other insert, update, and delete controller operations use `withTransaction`.
- Procedure: `enroll_new_student` inserts the student and enrolls them in their department group as one workflow; the API transaction commits or rolls back both changes.
- Function: `get_resource_vote_score(resource_id)` computes a resource's net up/down votes and is used in vote responses.
- Triggers: `votes_validate_type` validates vote values; `votes_audit_changes` records vote inserts, changes, and removals in `VOTE_AUDIT`.
- Complex queries: `getAllDoubtsController` joins student/course/answer data and aggregates answer counts; `getPostsController` joins resources, students, groups, votes and comment counts; `getBookmarkedPosts` joins bookmarks, resources, students and departments.