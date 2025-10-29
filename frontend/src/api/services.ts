import api from './index';

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'voter' | 'candidate' | 'admin';
  }) => api.post('/auth/register', data),
  
  getProfile: () => api.get('/auth/profile'),
};

// Poll API
export const pollAPI = {
  createPoll: (data: {
    title: string;
    description: string;
    pollType: 'candidate_based' | 'generic';
    allowMultipleVotes?: boolean;
    options: Array<{
      optionText: string;
      candidateId?: number;
    }>;
  }) => api.post('/polls', data),
  
  getAllPolls: () => api.get('/polls'),
  
  getPoll: (id: number) => api.get(`/polls/${id}`),
  
  getPollResults: (id: number) => api.get(`/polls/${id}/results`),
  
  vote: (pollId: number, optionId: number) =>
    api.post(`/polls/${pollId}/vote`, { optionId }),
  
  updatePollStatus: (pollId: number, status: 'draft' | 'active' | 'closed') =>
    api.put(`/polls/${pollId}/status`, { status }),
};

// Users API (consolidated user and candidate management)
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  
  getAllCandidates: () => api.get('/users/candidates'),
  
  getUserById: (id: number) => api.get(`/users/${id}`),
  
  createUser: (data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'voter' | 'candidate' | 'admin';
  }) => api.post('/users', data),
  
  updateUserRole: (userId: number, role: 'voter' | 'candidate' | 'admin') =>
    api.put(`/users/${userId}/role`, { role }),
  
  promoteToCandidate: (userId: number) =>
    api.put(`/users/${userId}/promote-candidate`),
  
  promoteToAdmin: (userId: number) =>
    api.put(`/users/${userId}/promote-admin`),
  
  demoteToVoter: (userId: number) =>
    api.put(`/users/${userId}/demote`),
  
  deleteUser: (userId: number) =>
    api.delete(`/users/${userId}`),
};

// Candidates API (for candidate dashboard features)
export const candidatesAPI = {
  getMyStats: () => api.get('/candidates/stats'),
  
  getMyPolls: () => api.get('/candidates/polls'),
  
  getPollResults: (pollId: number) =>
    api.get(`/candidates/polls/${pollId}/results`),
};

// Types for better TypeScript support
export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'voter' | 'candidate' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  pollType: 'candidate_based' | 'generic';
  status: 'draft' | 'active' | 'closed';
  allowMultipleVotes: boolean;
  createdById: number;
  createdBy?: User;
  options?: PollOption[];
  votes?: Vote[];
  createdAt: string;
  updatedAt: string;
}

export interface PollOption {
  id: number;
  pollId: number;
  optionText: string;
  candidateId?: number;
  orderIndex: number;
  candidate?: User;
  votes?: Vote[];
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: number;
  pollId: number;
  userId: number;
  optionId: number;
  poll?: Poll;
  user?: User;
  option?: PollOption;
  createdAt: string;
}

export interface PollResult {
  optionId: number;
  optionText: string;
  voteCount: number;
}