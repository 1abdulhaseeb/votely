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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.polls-grid {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.poll-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.poll-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.poll-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.poll-card p {
  margin: 0 0 10px 0;
  color: #666;
}

.poll-date {
  font-size: 0.9em;
  color: #999;
}

.no-polls {
  text-align: center;
  color: #666;
  margin-top: 40px;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 20px;
}
</style>