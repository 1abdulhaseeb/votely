<template>
  <div class="page">
    <div v-if="loading">Loading poll...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="poll" class="poll-detail">
      <h1>{{ poll.title }}</h1>
      <p class="poll-description">{{ poll.description }}</p>
      
      <div class="poll-options">
        <h3>Vote for your choice:</h3>
        <div v-for="option in poll.options" :key="option.id" class="option">
          <button 
            @click="vote(option.id)"
            :disabled="hasVoted"
            :class="{ voted: hasVoted && votedOption === option.id }"
            class="option-button"
          >
            <span class="option-text">{{ option.text }}</span>
            <span class="option-votes">{{ option.votes }} votes</span>
          </button>
        </div>
      </div>
      
      <div v-if="hasVoted" class="vote-status">
        ✓ You have voted! Thanks for participating.
      </div>
      
      <router-link to="/" class="back-link">← Back to polls</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const poll = ref(null);
const loading = ref(true);
const error = ref('');
const hasVoted = ref(false);
const votedOption = ref(null);

const pollId = route.params.id;

onMounted(async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get(`/polls/${pollId}`);
    // poll.value = response.data;
    
    // Mock data for now
    poll.value = {
      id: pollId,
      title: "Favorite Programming Language",
      description: "Vote for your favorite programming language for web development",
      options: [
        { id: 1, text: "JavaScript", votes: 45 },
        { id: 2, text: "TypeScript", votes: 38 },
        { id: 3, text: "Python", votes: 25 },
        { id: 4, text: "Go", votes: 12 }
      ]
    };
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load poll';
  } finally {
    loading.value = false;
  }
});

async function vote(optionId: number) {
  if (hasVoted.value) return;
  
  try {
    // TODO: Replace with actual API call
    // await api.post(`/polls/${pollId}/vote`, { optionId });
    
    // Mock voting
    const option = poll.value.options.find(o => o.id === optionId);
    if (option) {
      option.votes++;
      hasVoted.value = true;
      votedOption.value = optionId;
    }
  } catch (e: any) {
    alert(e?.response?.data?.message || 'Failed to vote');
  }
}
</script>

<style scoped>
.page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.poll-detail h1 {
  color: #333;
  margin-bottom: 10px;
}

.poll-description {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1em;
}

.poll-options h3 {
  color: #333;
  margin-bottom: 20px;
}

.option {
  margin-bottom: 12px;
}

.option-button {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-button:hover:not(:disabled) {
  border-color: #007bff;
  background: #f8f9fa;
}

.option-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.option-button.voted {
  border-color: #28a745;
  background: #d4edda;
}

.option-text {
  font-weight: 500;
  color: #333;
}

.option-votes {
  color: #666;
  font-size: 0.9em;
}

.vote-status {
  margin: 20px 0;
  padding: 15px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.error {
  color: #dc3545;
  text-align: center;
  margin-top: 20px;
}
</style>