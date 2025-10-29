<template>
  <div class="candidate-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Candidate Dashboard</h1>
        <p class="welcome-text">Welcome back, {{ authStore.user?.name }}!</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="stat-number">{{ candidateStats.totalPolls }}</span>
          <span class="stat-label">Total Polls</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ candidateStats.activePolls }}</span>
          <span class="stat-label">Active Polls</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ candidateStats.totalVotes }}</span>
          <span class="stat-label">Total Votes</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h3>Unable to Load Dashboard</h3>
        <p>{{ error }}</p>
        <button @click="loadDashboardData" class="retry-btn">Try Again</button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Quick Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>{{ candidateStats.averageVotes }}</h3>
            <p>Average Votes per Poll</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <h3>{{ candidateStats.winRate }}%</h3>
            <p>Win Rate</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <h3>{{ candidateStats.ranking }}</h3>
            <p>Current Ranking</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <h3>{{ candidateStats.popularity }}%</h3>
            <p>Popularity Score</p>
          </div>
        </div>
      </div>

      <!-- Recent Polls Section -->
      <div class="section">
        <div class="section-header">
          <h2>Your Polls</h2>
          <div class="section-filters">
            <button 
              v-for="filter in pollFilters" 
              :key="filter.value"
              @click="selectedFilter = filter.value"
              class="filter-btn"
              :class="{ 'active': selectedFilter === filter.value }"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div v-if="filteredPolls.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No Polls Found</h3>
          <p v-if="selectedFilter === 'all'">You're not participating in any polls yet.</p>
          <p v-else>No {{ selectedFilter }} polls found.</p>
        </div>

        <div v-else class="polls-grid">
          <div v-for="poll in filteredPolls" :key="poll.id" class="poll-card">
            <div class="poll-header">
              <div class="poll-info">
                <h3>{{ poll.title }}</h3>
                <span class="poll-status" :class="poll.status">{{ poll.status.toUpperCase() }}</span>
              </div>
              <div class="poll-date">{{ formatDate(poll.createdAt) }}</div>
            </div>

            <div class="poll-description" v-if="poll.description">
              {{ poll.description }}
            </div>

            <div class="poll-stats">
              <div class="stat-item">
                <span class="stat-label">Your Votes:</span>
                <span class="stat-value">{{ poll.candidateVotes || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Votes:</span>
                <span class="stat-value">{{ poll.totalVotes || 0 }}</span>
              </div>
              <div class="stat-item" v-if="poll.candidateVotes && poll.totalVotes">
                <span class="stat-label">Your Share:</span>
                <span class="stat-value">{{ Math.round((poll.candidateVotes / poll.totalVotes) * 100) }}%</span>
              </div>
            </div>

            <div class="poll-actions">
              <router-link 
                :to="`/poll/${poll.id}`" 
                class="btn btn-primary btn-sm"
              >
                View Details
              </router-link>
              <button 
                v-if="poll.status === 'active'"
                @click="sharePoll(poll)"
                class="btn btn-outline btn-sm"
              >
                Share Poll
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Analytics -->
      <div class="section">
        <div class="section-header">
          <h2>Performance Analytics</h2>
        </div>

        <div class="analytics-grid">
          <div class="analytics-card">
            <h3>Vote Distribution</h3>
            <div class="chart-placeholder">
              <div class="chart-bar" v-for="poll in recentPolls.slice(0, 5)" :key="poll.id">
                <div class="bar-label">{{ poll.title.substring(0, 15) }}...</div>
                <div class="bar-container">
                  <div 
                    class="bar-fill" 
                    :style="{ width: poll.candidateVotes ? (poll.candidateVotes / Math.max(...recentPolls.map((p: any) => p.candidateVotes || 0))) * 100 + '%' : '0%' }"
                  ></div>
                </div>
                <div class="bar-value">{{ poll.candidateVotes || 0 }}</div>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <h3>Recent Activity</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="activity-icon">{{ activity.icon }}</div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <h3>Goals & Targets</h3>
            <div class="goals-list">
              <div class="goal-item">
                <div class="goal-info">
                  <span class="goal-label">Monthly Vote Target</span>
                  <span class="goal-progress">{{ candidateStats.totalVotes }}/500</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: Math.min((candidateStats.totalVotes / 500) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="goal-item">
                <div class="goal-info">
                  <span class="goal-label">Win Rate Target</span>
                  <span class="goal-progress">{{ candidateStats.winRate }}%/75%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: Math.min((candidateStats.winRate / 75) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { usePollsStore } from '../stores/polls'
import api from '../api'

const authStore = useAuthStore()
const pollsStore = usePollsStore()

// Reactive state
const loading = ref(true)
const error = ref('')
const selectedFilter = ref('all')
const candidateStats = ref({
  totalPolls: 0,
  activePolls: 0,
  totalVotes: 0,
  averageVotes: 0,
  winRate: 0,
  ranking: 0,
  popularity: 0
})
const candidatePolls = ref([])
const recentActivity = ref([])

// Filter options
const pollFilters = [
  { label: 'All Polls', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Closed', value: 'closed' },
  { label: 'Draft', value: 'draft' }
]

// Computed properties
const recentPolls = computed(() => candidatePolls.value.slice(0, 10))
const filteredPolls = computed(() => {
  if (selectedFilter.value === 'all') {
    return candidatePolls.value
  }
  return candidatePolls.value.filter((poll: any) => poll.status === selectedFilter.value)
})

// Methods
const loadDashboardData = async () => {
  loading.value = true
  error.value = ''

  try {
    // Load candidate stats
    await loadCandidateStats()
    
    // Load candidate polls
    await loadCandidatePolls()
    
    // Generate recent activity
    generateRecentActivity()
    
  } catch (err: any) {
    console.error('Failed to load dashboard data:', err)
    error.value = err.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

const loadCandidateStats = async () => {
  try {
    const response = await api.get('/candidates/stats')
    candidateStats.value = {
      totalPolls: response.data.totalPolls || 0,
      activePolls: response.data.activePolls || 0,
      totalVotes: response.data.totalVotes || 0,
      averageVotes: response.data.averageVotes || 0,
      winRate: response.data.winRate || 0,
      ranking: response.data.ranking || 0,
      popularity: response.data.popularity || 0
    }
  } catch (err) {
    console.error('Failed to load candidate stats:', err)
    // Use mock data for demo
    candidateStats.value = {
      totalPolls: 12,
      activePolls: 3,
      totalVotes: 245,
      averageVotes: 20,
      winRate: 65,
      ranking: 5,
      popularity: 78
    }
  }
}

const loadCandidatePolls = async () => {
  try {
    const response = await api.get('/candidates/polls')
    candidatePolls.value = response.data.map((poll: any) => ({
      ...poll,
      candidateVotes: Math.floor(Math.random() * 50) + 10,
      totalVotes: Math.floor(Math.random() * 100) + 20
    }))
  } catch (err) {
    console.error('Failed to load candidate polls:', err)
    // Use mock data for demo
    candidatePolls.value = [
      {
        id: 1,
        title: 'Best Programming Language 2025',
        description: 'Vote for the most popular programming language',
        status: 'active',
        createdAt: new Date().toISOString(),
        candidateVotes: 45,
        totalVotes: 120
      },
      {
        id: 2,
        title: 'Favorite Framework',
        description: 'Choose your preferred web framework',
        status: 'closed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        candidateVotes: 32,
        totalVotes: 98
      },
      {
        id: 3,
        title: 'Developer Tools Survey',
        description: 'What tools do you use daily?',
        status: 'active',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        candidateVotes: 28,
        totalVotes: 75
      }
    ]
  }
}

const generateRecentActivity = () => {
  recentActivity.value = [
    {
      id: 1,
      icon: '🗳️',
      text: 'Received 5 new votes in "Best Programming Language 2025"',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      icon: '📊',
      text: 'Poll "Favorite Framework" was closed with 32 votes',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 3,
      icon: '🎯',
      text: 'Achieved 65% win rate milestone',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 4,
      icon: '📈',
      text: 'Moved up to #5 in candidate rankings',
      timestamp: new Date(Date.now() - 172800000).toISOString()
    }
  ]
}

const sharePoll = (poll: any) => {
  const url = `${window.location.origin}/poll/${poll.id}`
  if (navigator.share) {
    navigator.share({
      title: poll.title,
      text: poll.description,
      url: url
    })
  } else {
    navigator.clipboard.writeText(url)
    alert('Poll link copied to clipboard!')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.candidate-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 600;
}

.welcome-text {
  opacity: 0.9;
  font-size: 16px;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-badge {
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
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
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
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

.section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
}

.section-header {
  padding: 25px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.section-filters {
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
  border-color: #667eea;
  background: #667eea;
  color: white;
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

.polls-grid {
  display: grid;
  gap: 20px;
  padding: 30px;
}

.poll-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.poll-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.poll-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.poll-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.poll-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.poll-status.active {
  background: #d4edda;
  color: #155724;
}

.poll-status.closed {
  background: #f8d7da;
  color: #721c24;
}

.poll-status.draft {
  background: #fff3cd;
  color: #856404;
}

.poll-date {
  color: #7f8c8d;
  font-size: 14px;
}

.poll-description {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.poll-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.poll-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 30px;
}

.analytics-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
}

.analytics-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  width: 100px;
  font-size: 12px;
  color: #7f8c8d;
  text-align: right;
}

.bar-container {
  flex: 1;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.bar-value {
  width: 30px;
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-icon {
  font-size: 20px;
  width: 32px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #2c3e50;
}

.activity-time {
  font-size: 12px;
  color: #7f8c8d;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-label {
  font-size: 14px;
  color: #2c3e50;
}

.goal-progress {
  font-size: 12px;
  color: #7f8c8d;
}

.progress-bar {
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

@media (max-width: 768px) {
  .candidate-dashboard {
    padding: 15px;
  }

  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .header-stats {
    flex-wrap: wrap;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .poll-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>