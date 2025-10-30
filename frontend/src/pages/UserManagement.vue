<template>
  <div class="user-management">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>User Management</h1>
        <p>Manage users, roles, and permissions</p>
      </div>
      <div class="header-actions">
        <button @click="showCreateUserModal = true" class="btn btn-primary">
          <span class="btn-icon">👤</span>
          Add New User
        </button>
        <button @click="refreshUsers" class="btn btn-outline" :disabled="loading">
          <span class="btn-icon">🔄</span>
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>{{ userStats.totalUsers }}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👑</div>
        <div class="stat-info">
          <h3>{{ userStats.admins }}</h3>
          <p>Administrators</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏃</div>
        <div class="stat-info">
          <h3>{{ userStats.candidates }}</h3>
          <p>Candidates</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🗳️</div>
        <div class="stat-info">
          <h3>{{ userStats.voters }}</h3>
          <p>Voters</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search users by name, email, or username..."
          class="search-input"
        />
        <button class="search-btn">
          <span class="search-icon">🔍</span>
        </button>
      </div>
      
      <div class="filter-buttons">
        <button 
          v-for="filter in roleFilters" 
          :key="filter.value"
          @click="selectedRole = filter.value"
          class="filter-btn"
          :class="{ 'active': selectedRole === filter.value }"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h3>Error Loading Users</h3>
        <p>{{ error }}</p>
        <button @click="loadUsers" class="retry-btn">Try Again</button>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="users-section">
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.name || user.username) }}
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.name || user.username }}</div>
                  <div class="user-username">@{{ user.username }}</div>
                </div>
              </td>
              <td class="user-email">{{ user.email }}</td>
              <td class="user-role">
                <span class="role-badge" :class="user.role">
                  {{ user.role.toUpperCase() }}
                </span>
              </td>
              <td class="user-status">
                <span class="status-badge" :class="user.status || 'active'">
                  {{ (user.status || 'active').toUpperCase() }}
                </span>
              </td>
              <td class="user-joined">{{ formatDate(user.createdAt) }}</td>
              <td class="user-actions">
                <div class="actions-dropdown">
                  <button 
                    class="actions-btn"
                    @click="toggleActionsMenu(user.id)"
                  >
                    ⋮
                  </button>
                  <div 
                    v-if="activeDropdown === user.id" 
                    class="actions-menu"
                  >
                    <button 
                      v-if="user.role === 'voter'"
                      @click="promoteToCandidate(user)"
                      class="action-item promote"
                    >
                      <span class="action-icon">🏃</span>
                      Promote to Candidate
                    </button>
                    <button 
                      v-if="user.role !== 'admin'"
                      @click="promoteToAdmin(user)"
                      class="action-item promote"
                    >
                      <span class="action-icon">👑</span>
                      Promote to Admin
                    </button>
                    <button 
                      v-if="user.role !== 'voter'"
                      @click="demoteToVoter(user)"
                      class="action-item demote"
                    >
                      <span class="action-icon">🗳️</span>
                      Demote to Voter
                    </button>
                    <button 
                      @click="editUser(user)"
                      class="action-item edit"
                    >
                      <span class="action-icon">✏️</span>
                      Edit User
                    </button>
                    <button 
                      @click="deleteUser(user)"
                      class="action-item delete"
                    >
                      <span class="action-icon">🗑️</span>
                      Delete User
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <div class="empty-icon">👤</div>
        <h3>No Users Found</h3>
        <p v-if="searchQuery">No users match your search criteria.</p>
        <p v-else-if="selectedRole !== 'all'">No users with {{ selectedRole }} role found.</p>
        <p v-else>No users have been created yet.</p>
      </div>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateUserModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New User</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createUser" class="user-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                id="name"
                v-model="newUser.name" 
                type="text" 
                required
                class="form-input"
                placeholder="Enter full name"
              />
            </div>
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                id="username"
                v-model="newUser.username" 
                type="text" 
                required
                class="form-input"
                placeholder="Enter username"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email"
                v-model="newUser.email" 
                type="email" 
                required
                class="form-input"
                placeholder="Enter email address"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="newUser.password" 
                type="password" 
                required
                class="form-input"
                placeholder="Enter password"
              />
            </div>
            <div class="form-group">
              <label for="role">Role</label>
              <select 
                id="role"
                v-model="newUser.role" 
                class="form-select"
                required
              >
                <option value="voter">Voter</option>
                <option value="candidate">Candidate</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                {{ creating ? 'Creating...' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const authStore = useAuthStore()

// Reactive state
const loading = ref(true)
const error = ref('')
const users = ref([])
const searchQuery = ref('')
const selectedRole = ref('all')
const activeDropdown = ref<number | null>(null)
const showCreateUserModal = ref(false)
const creating = ref(false)

// User stats
const userStats = ref({
  totalUsers: 0,
  admins: 0,
  candidates: 0,
  voters: 0
})

// New user form
const newUser = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'voter'
})

// Filter options
const roleFilters = [
  { label: 'All Users', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'Candidates', value: 'candidate' },
  { label: 'Voters', value: 'voter' }
]

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by role
  if (selectedRole.value !== 'all') {
    filtered = filtered.filter((user: any) => user.role === selectedRole.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((user: any) => 
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Methods
const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/users')
    users.value = response.data
    calculateStats()
  } catch (err: any) {
    console.error('Failed to load users:', err)
    error.value = err.message || 'Failed to load users'
    // Use mock data for demo
    users.value = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        role: 'candidate',
        status: 'active',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        name: 'Bob Johnson',
        username: 'bobjohnson',
        email: 'bob@example.com',
        role: 'voter',
        status: 'active',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ]
    calculateStats()
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const stats = users.value.reduce((acc: any, user: any) => {
    acc.totalUsers++
    acc[user.role + 's']++
    return acc
  }, { totalUsers: 0, admins: 0, candidates: 0, voters: 0 })
  
  userStats.value = stats
}

const refreshUsers = () => {
  loadUsers()
}

const toggleActionsMenu = (userId: number) => {
  activeDropdown.value = activeDropdown.value === userId ? null : userId
}

const promoteToCandidate = async (user: any) => {
  try {
    await api.put(`/users/${user.id}/role`, { role: 'candidate' })
    user.role = 'candidate'
    calculateStats()
    activeDropdown.value = null
  } catch (err: any) {
    console.error('Failed to promote user:', err)
    alert('Failed to promote user to candidate')
  }
}

const promoteToAdmin = async (user: any) => {
  if (!confirm(`Are you sure you want to promote ${user.name} to Administrator?`)) {
    return
  }
  
  try {
    await api.put(`/users/${user.id}/role`, { role: 'admin' })
    user.role = 'admin'
    calculateStats()
    activeDropdown.value = null
  } catch (err: any) {
    console.error('Failed to promote user:', err)
    alert('Failed to promote user to admin')
  }
}

const demoteToVoter = async (user: any) => {
  if (!confirm(`Are you sure you want to demote ${user.name} to Voter?`)) {
    return
  }
  
  try {
    await api.put(`/users/${user.id}/role`, { role: 'voter' })
    user.role = 'voter'
    calculateStats()
    activeDropdown.value = null
  } catch (err: any) {
    console.error('Failed to demote user:', err)
    alert('Failed to demote user')
  }
}

const editUser = (user: any) => {
  // Implement user editing
  console.log('Edit user:', user)
  activeDropdown.value = null
}

const deleteUser = async (user: any) => {
  if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
    return
  }
  
  try {
    await api.delete(`/users/${user.id}`)
    users.value = users.value.filter((u: any) => u.id !== user.id)
    calculateStats()
    activeDropdown.value = null
  } catch (err: any) {
    console.error('Failed to delete user:', err)
    alert('Failed to delete user')
  }
}

const createUser = async () => {
  creating.value = true
  
  try {
    const response = await api.post('/users', newUser.value)
    users.value.push(response.data)
    calculateStats()
    closeModal()
    resetForm()
  } catch (err: any) {
    console.error('Failed to create user:', err)
    alert('Failed to create user: ' + (err.message || 'Unknown error'))
  } finally {
    creating.value = false
  }
}

const closeModal = () => {
  showCreateUserModal.value = false
  resetForm()
}

const resetForm = () => {
  newUser.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'voter'
  }
}

const getInitials = (name: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
  if (!(event.target as Element).closest('.actions-dropdown')) {
    activeDropdown.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f8f9fa;
}

.header-content h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 32px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-outline:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.btn-icon {
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.filters-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #3498db;
}

.search-btn {
  padding: 12px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.search-icon {
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #ecf0f1;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-btn.active,
.filter-btn:hover {
  border-color: #3498db;
  background: #3498db;
  color: white;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.error-card {
  background: #fff;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.retry-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.users-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.user-row:hover {
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.user-username {
  font-size: 12px;
  color: #7f8c8d;
}

.user-email {
  color: #7f8c8d;
  font-size: 14px;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.role-badge.admin {
  background: #7c3aed;
  color: white;
}

.role-badge.candidate {
  background: #d97706;
  color: white;
}

.role-badge.voter {
  background: #059669;
  color: white;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.user-joined {
  color: #7f8c8d;
  font-size: 14px;
}

.actions-dropdown {
  position: relative;
}

.actions-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  color: #7f8c8d;
}

.actions-btn:hover {
  background: #f8f9fa;
}

.actions-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 180px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 15px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
}

.action-item:hover {
  background: #f8f9fa;
}

.action-item.promote {
  color: #059669;
}

.action-item.demote {
  color: #f39c12;
}

.action-item.edit {
  color: #3498db;
}

.action-item.delete {
  color: #e74c3c;
}

.action-icon {
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 30px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 30px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: #3498db;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .user-management {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .search-bar {
    max-width: none;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .users-table {
    font-size: 12px;
  }

  .users-table th,
  .users-table td {
    padding: 10px 8px;
  }

  .user-info {
    gap: 10px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .modal-content {
    width: 95%;
  }

  .modal-header,
  .modal-body {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>