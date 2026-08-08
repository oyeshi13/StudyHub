import { mockExploreDepartments } from '../data/mockDepartments';

// Simulating the database state
let departmentsTable = [...mockExploreDepartments];

export const departmentService = {
  // GET /api/departments
  getDepartments: async () => {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve([...departmentsTable]), 300));
  },

  // POST /api/departments/:departmentId/join
  joinDepartment: async (departmentId) => {
    // In a real app, this would create a record in a UserDepartments join table
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400));
  }
};