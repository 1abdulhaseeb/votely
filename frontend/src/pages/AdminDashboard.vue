<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p>Manage polls, users, and candidates</p>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>{{ stats.totalPolls }}</h3>
          <p>Total Polls</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3>{{ stats.activePolls }}</h3>
          <p>Active Polls</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>Total Users</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <h3>{{ stats.totalCandidates }}</h3>
          <p>Candidates</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/create-poll" class="action-card">
          <div class="action-icon">➕</div>
          <h3>Create New Poll</h3>
          <p>Design and launch a new poll</p>
        </router-link>
        
        <router-link to="/admin/users" class="action-card">
          <div class="action-icon">👤</div>
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </router-link>
        
        <router-link to="/admin/candidates" class="action-card">
          <div class="action-icon">🏆</div>
          <h3>Manage Candidates</h3>
          <p>Promote users to candidates</p>
        </router-link>
        
        <button @click="exportData" class="action-card">
          <div class="action-icon">📈</div>
          <h3>Export Data</h3>
          <p>Download poll results and analytics</p>
        </button>
      </div>
    </div>

    <!-- Recent Polls -->
    <div class="recent-polls">
      <div class="section-header">
        <h2>Recent Polls</h2>
        <router-link to="/polls" class="view-all-link">View All</router-link>
      </div>
      
      <div v-if="pollsStore.loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading polls...</p>
      </div>
      
      <div v-else-if="recentPolls.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No polls yet</h3>
        <p>Create your first poll to get started</p>
        <router-link to="/create-poll" class="create-first-btn">Create Poll</router-link>
      </div>
      
      <div v-else class="polls-table">
        <div class="table-header">
          <div class="header-cell">Poll</div>
          <div class="header-cell">Status</div>
          <div class="header-cell">Type</div>
          <div class="header-cell">Options</div>
          <div class="header-cell">Created</div>
          <div class="header-cell">Actions</div>
        </div>
        
        <div 
          v-for="poll in recentPolls" 
          :key="poll.id" 
          class="table-row"
        >
          <div class="cell poll-cell">
            <h4>{{ poll.title }}</h4>
            <p>{{ truncateText(poll.description, 60) }}</p>
          </div>
          
          <div class="cell status-cell">
            <span class="status-badge" :class="poll.status">
              {{ poll.status }}
            </span>
          </div>
          
          <div class="cell type-cell">
            <span class="type-badge">
              {{ poll.pollType === 'candidate_based' ? 'Candidate' : 'Generic' }}
            </span>
          </div>
          
          <div class="cell options-cell">
            {{ poll.options?.length || 0 }}
          </div>
          
          <div class="cell date-cell">
            {{ formatDate(poll.createdAt) }}
          </div>
          
          <div class="cell actions-cell">
            <div class="action-buttons">
              <router-link :to="`/poll/${poll.id}`" class="action-btn view-btn">
                👁️ View
              </router-link>
              
              <button 
                v-if="poll.status === 'draft'"
                @click="activatePoll(poll.id)"
                class="action-btn activate-btn"
              >
                🚀 Activate
              </button>
              
              <button 
                v-if="poll.status === 'active'"
                @click="closePoll(poll.id)"
                class="action-btn close-btn"
              >
                🔒 Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="system-status">
      <h2>System Status</h2>
      <div class="status-grid">
        <div class="status-item">
          <div class="status-indicator active"></div>
          <div class="status-content">
            <h4>Database</h4>
            <p>Connected and operational</p>
          </div>
        </div>
        
        <div class="status-item">
          <div class="status-indicator active"></div>
          <div class="status-content">
            <h4>API Server</h4>
            <p>Running smoothly</p>
          </div>
        </div>
        
        <div class="status-item">
          <div class="status-indicator active"></div>
          <div class="status-content">
            <h4>Authentication</h4>
            <p>Service available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePollsStore } from '../stores/polls';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const pollsStore = usePollsStore();
const authStore = useAuthStore();

// Check if user is admin
const isAdmin = computed(() => authStore.user?.role === 'admin');

// Redirect if not admin
if (!isAdmin.value) {
  router.push('/polls');
}

const stats = ref({
  totalPolls: 0,
  activePolls: 0,
  totalUsers: 0,
  totalCandidates: 0
});

// Computed
const recentPolls = computed(() => {
  return pollsStore.polls.slice(0, 5); // Show only 5 most recent polls
});

// Methods
async function loadDashboardData() {
  try {
    await pollsStore.fetchPolls();
    await pollsStore.fetchCandidates();
    
    // Calculate stats
    stats.value.totalPolls = pollsStore.polls.length;
    stats.value.activePolls = pollsStore.activePolls.length;
    stats.value.totalCandidates = pollsStore.candidates.length;
    
    // Note: totalUsers would need a separate API call
    stats.value.totalUsers = 0; // Placeholder
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

async function activatePoll(pollId: number) {
  try {
    await pollsStore.updatePollStatus(pollId, 'active');
    await loadDashboardData(); // Refresh data
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to activate poll');
  }
}

async function closePoll(pollId: number) {
  if (confirm('Are you sure you want to close this poll? This action cannot be undone.')) {
    try {
      await pollsStore.updatePollStatus(pollId, 'closed');
      await loadDashboardData(); // Refresh data
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to close poll');
    }
  }
}

function exportData() {
  // Placeholder for export functionality
  alert('Export functionality coming soon!');
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Lifecycle
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #1E3185;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid rgba(30, 49, 133, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(30, 49, 133, 0.08);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(30, 49, 133, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-content h3 {
  color: #1E3185;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.stat-content p {
  color: rgba(30, 49, 133, 0.7);
  font-weight: 600;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  color: #1E3185;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid rgba(30, 49, 133, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  display: block;
  text-align: center;
  box-shadow: 0 4px 20px rgba(30, 49, 133, 0.08);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(30, 49, 133, 0.15);
  border-color: #1E3185;
  text-decoration: none;
  color: inherit;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #1E3185;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: rgba(30, 49, 133, 0.7);
  line-height: 1.5;
}

.recent-polls {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  color: #1E3185;
  font-size: 1.8rem;
  font-weight: 700;
}

.view-all-link {
  color: #1E3185;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  background: rgba(30, 49, 133, 0.1);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(30, 49, 133, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(30, 49, 133, 0.2);
  border-top: 3px solid #1E3185;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #1E3185;
  margin-bottom: 0.5rem;
}

.create-first-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #1E3185;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.create-first-btn:hover {
  background: #162661;
}

.polls-table {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(30, 49, 133, 0.1);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(30, 49, 133, 0.08);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 80px 120px 140px;
  gap: 1rem;
  align-items: center;
}

.table-header {
  background: rgba(30, 49, 133, 0.05);
  padding: 1rem;
  font-weight: 700;
  color: #1E3185;
  border-bottom: 1px solid rgba(30, 49, 133, 0.1);
}

.table-row {
  padding: 1rem;
  border-bottom: 1px solid rgba(30, 49, 133, 0.05);
  transition: all 0.3s ease;
}

.table-row:hover {
  background: rgba(30, 49, 133, 0.02);
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  font-size: 0.9rem;
}

.poll-cell h4 {
  color: #1E3185;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.poll-cell p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 0.85rem;
  line-height: 1.3;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #22c55e;
  color: white;
}

.status-badge.draft {
  background: #f59e0b;
  color: white;
}

.status-badge.closed {
  background: #6b7280;
  color: white;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: rgba(30, 49, 133, 0.1);
  color: #1E3185;
  font-size: 0.8rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.view-btn {
  background: rgba(30, 49, 133, 0.1);
  color: #1E3185;
}

.view-btn:hover {
  background: rgba(30, 49, 133, 0.2);
}

.activate-btn {
  background: #22c55e;
  color: white;
}

.activate-btn:hover {
  background: #16a34a;
}

.close-btn {
  background: #ef4444;
  color: white;
}

.close-btn:hover {
  background: #dc2626;
}

.system-status h2 {
  color: #1E3185;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.status-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(30, 49, 133, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.active {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

.status-content h4 {
  color: #1E3185;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.status-content p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 120px;
  }
  
  .options-cell,
  .date-cell {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    padding: 1rem;
    display: block;
  }
  
  .cell {
    margin-bottom: 0.5rem;
  }
  
  .actions-cell {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(30, 49, 133, 0.1);
  }
}
</style>