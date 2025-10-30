<template>
  <div class="polls-page">
    <div class="polls-header">
      <div class="header-content">
        <h1>All Polls</h1>
        <p>Discover and participate in active polls</p>
      </div>
      <div class="header-actions" v-if="isAdmin">
        <router-link to="/create-poll" class="create-poll-btn">
          <span class="btn-icon">➕</span>
          Create Poll
        </router-link>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        class="filter-tab"
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        All Polls
      </button>
      <button 
        class="filter-tab"
        :class="{ active: activeFilter === 'active' }"
        @click="activeFilter = 'active'"
      >
        Active
      </button>
      <button 
        class="filter-tab"
        :class="{ active: activeFilter === 'draft' }"
        @click="activeFilter = 'draft'"
        v-if="isAdmin"
      >
        Drafts
      </button>
      <button 
        class="filter-tab"
        :class="{ active: activeFilter === 'closed' }"
        @click="activeFilter = 'closed'"
      >
        Closed
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pollsStore.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading polls...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="pollsStore.error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Error Loading Polls</h3>
      <p>{{ pollsStore.error }}</p>
      <button @click="loadPolls" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPolls.length === 0" class="empty-container">
      <div class="empty-icon">📊</div>
      <h3>No Polls Found</h3>
      <p v-if="activeFilter === 'all'">No polls have been created yet.</p>
      <p v-else>No {{ activeFilter }} polls available.</p>
      <router-link v-if="isAdmin && activeFilter === 'all'" to="/create-poll" class="create-first-poll-btn">
        Create Your First Poll
      </router-link>
    </div>

    <!-- Polls Grid -->
    <div v-else class="polls-grid">
      <div 
        v-for="poll in filteredPolls" 
        :key="poll.id" 
        class="poll-card"
        @click="goToPoll(poll.id)"
      >
        <div class="poll-card-header">
          <div class="poll-status" :class="poll.status">
            {{ poll.status.charAt(0).toUpperCase() + poll.status.slice(1) }}
          </div>
          <div class="poll-type" :class="poll.pollType">
            {{ poll.pollType === 'candidate_based' ? 'Candidate' : 'Generic' }}
          </div>
        </div>
        
        <div class="poll-card-content">
          <h3>{{ poll.title }}</h3>
          <p>{{ poll.description }}</p>
          
          <div class="poll-meta">
            <div class="meta-item">
              <span class="meta-icon">�️</span>
              <span>{{ poll.totalVotes || 0 }} {{ (poll.totalVotes || 0) === 1 ? 'vote' : 'votes' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📋</span>
              <span>{{ poll.options?.length || 0 }} {{ (poll.options?.length || 0) === 1 ? 'option' : 'options' }}</span>
            </div>
            <div class="meta-item" v-if="poll.allowMultipleVotes">
              <span class="meta-icon">✅</span>
              <span>Multiple votes allowed</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>{{ formatDate(poll.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="poll-card-footer">
          <button 
            v-if="poll.status === 'active'" 
            class="vote-btn"
            @click.stop="goToPoll(poll.id)"
          >
            Vote Now
          </button>
          <button 
            v-else-if="poll.status === 'closed'" 
            class="results-btn"
            @click.stop="goToPoll(poll.id)"
          >
            View Results
          </button>
          <button 
            v-else-if="poll.status === 'draft' && isAdmin" 
            class="manage-btn"
            @click.stop="goToPoll(poll.id)"
          >
            Manage
          </button>
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

const activeFilter = ref<'all' | 'active' | 'draft' | 'closed'>('all');

// Computed
const isAdmin = computed(() => authStore.user?.role === 'admin');

const filteredPolls = computed(() => {
  if (activeFilter.value === 'all') {
    return pollsStore.polls;
  }
  return pollsStore.polls.filter(poll => poll.status === activeFilter.value);
});

// Methods
async function loadPolls() {
  try {
    await pollsStore.fetchPolls();
  } catch (error) {
    console.error('Failed to load polls:', error);
  }
}

function goToPoll(pollId: number) {
  router.push(`/poll/${pollId}`);
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
  loadPolls();
});
</script>

<style scoped>
.polls-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.polls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(30, 49, 133, 0.1);
}

.header-content h1 {
  color: #1E3185;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 1.2rem;
}

.create-poll-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.create-poll-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.4);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(30, 49, 133, 0.2);
  background: white;
  color: #1E3185;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: #1E3185;
  transform: translateY(-1px);
}

.filter-tab.active {
  background: #1E3185;
  color: white;
  border-color: #1E3185;
}

.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(30, 49, 133, 0.2);
  border-top: 4px solid #1E3185;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-container h3,
.empty-container h3 {
  color: #1E3185;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.retry-btn,
.create-first-poll-btn {
  padding: 0.75rem 1.5rem;
  background: #1E3185;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.retry-btn:hover,
.create-first-poll-btn:hover {
  background: #162661;
  transform: translateY(-1px);
}

.polls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.poll-card {
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(30, 49, 133, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.poll-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(30, 49, 133, 0.15);
  border-color: #1E3185;
}

.poll-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(30, 49, 133, 0.05);
}

.poll-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.poll-status.active {
  background: #22c55e;
  color: white;
}

.poll-status.draft {
  background: #f59e0b;
  color: white;
}

.poll-status.closed {
  background: #6b7280;
  color: white;
}

.poll-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(30, 49, 133, 0.1);
  color: #1E3185;
}

.poll-card-content {
  padding: 1.5rem;
}

.poll-card-content h3 {
  color: #1E3185;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.poll-card-content p {
  color: rgba(30, 49, 133, 0.7);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poll-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(30, 49, 133, 0.6);
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.poll-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(30, 49, 133, 0.1);
}

.vote-btn,
.results-btn,
.manage-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.vote-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.vote-btn:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
}

.results-btn {
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: white;
}

.results-btn:hover {
  background: linear-gradient(135deg, #162661 0%, #1E3185 100%);
}

.manage-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.manage-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .polls-page {
    padding: 1rem;
  }
  
  .polls-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
  
  .polls-grid {
    grid-template-columns: 1fr;
  }
  
  .poll-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>