<template>
  <div class="page">
    <h1>Polls</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="polls.length === 0" class="no-polls">
        No polls available yet.
      </div>
      <div v-else class="polls-grid">
        <div 
          v-for="poll in polls" 
          :key="poll.id" 
          class="poll-card"
          @click="viewPoll(poll.id)"
        >
          <h3>{{ poll.title }}</h3>
          <p>{{ poll.description }}</p>
          <span class="poll-date">{{ formatDate(poll.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();
const polls = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/polls');
    // polls.value = response.data;
    
    // Mock data for now
    polls.value = [
      {
        id: 1,
        title: "Favorite Programming Language",
        description: "Vote for your favorite programming language",
        createdAt: new Date()
      }
    ];
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load polls';
  } finally {
    loading.value = false;
  }
});

function viewPoll(pollId: number) {
  router.push(`/poll/${pollId}`);
}

function formatDate(date: Date) {
  return dayjs(date).format('MMM D, YYYY');
}
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page h1 {
  color: #1E3185;
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.polls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.poll-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 49, 133, 0.1);
  box-shadow: 0 4px 20px rgba(30, 49, 133, 0.08);
  position: relative;
  overflow: hidden;
}

.poll-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 49, 133, 0.05), transparent);
  transition: left 0.6s ease;
}

.poll-card:hover::before {
  left: 100%;
}

.poll-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(30, 49, 133, 0.15);
  border-color: rgba(30, 49, 133, 0.2);
}

.poll-card h3 {
  margin: 0 0 1rem 0;
  color: #1E3185;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
}

.poll-card p {
  margin: 0 0 1.5rem 0;
  color: rgba(30, 49, 133, 0.7);
  line-height: 1.6;
  font-size: 1rem;
}

.poll-date {
  font-size: 0.9rem;
  color: rgba(30, 49, 133, 0.5);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.poll-date::before {
  content: '📅';
  font-size: 0.8rem;
}

.no-polls {
  text-align: center;
  color: rgba(30, 49, 133, 0.6);
  margin-top: 4rem;
  padding: 3rem;
  background: rgba(30, 49, 133, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(30, 49, 133, 0.1);
}

.no-polls::before {
  content: '🗳️';
  display: block;
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.2);
  font-weight: 600;
}

.error::before {
  content: '⚠️';
  display: block;
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Loading state */
div:has(> :contains("Loading...")) {
  text-align: center;
  color: rgba(30, 49, 133, 0.6);
  font-size: 1.2rem;
  margin-top: 4rem;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page {
    padding: 1.5rem 1rem;
  }
  
  .page h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  .polls-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .poll-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page h1 {
    font-size: 2rem;
  }
}
</style>