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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.poll-detail h1 {
  color: #1E3185;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.poll-description {
  color: rgba(30, 49, 133, 0.7);
  margin-bottom: 3rem;
  font-size: 1.2rem;
  text-align: center;
  line-height: 1.6;
}

.poll-options {
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(30, 49, 133, 0.12);
  border: 1px solid rgba(30, 49, 133, 0.1);
  margin-bottom: 2rem;
}

.poll-options h3 {
  color: #1E3185;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.option {
  margin-bottom: 1.5rem;
}

.option-button {
  width: 100%;
  padding: 1.5rem;
  border: 2px solid rgba(30, 49, 133, 0.15);
  border-radius: 12px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.option-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 49, 133, 0.05), transparent);
  transition: left 0.6s ease;
}

.option-button:hover:not(:disabled)::before {
  left: 100%;
}

.option-button:hover:not(:disabled) {
  border-color: #1E3185;
  background: rgba(30, 49, 133, 0.03);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.15);
}

.option-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.option-button.voted {
  border-color: #28a745;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.option-button.voted::after {
  content: '✓';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #28a745;
  font-size: 1.5rem;
  font-weight: 800;
}

.option-text {
  font-weight: 600;
  color: #1E3185;
  font-size: 1.1rem;
}

.option-votes {
  color: rgba(30, 49, 133, 0.7);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: rgba(30, 49, 133, 0.1);
  border-radius: 20px;
}

.vote-status {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%);
  color: #155724;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid rgba(40, 167, 69, 0.2);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.1);
}

.vote-status::before {
  content: '🎉';
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: #1E3185;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(30, 49, 133, 0.2);
  border-radius: 25px;
  transition: all 0.3s ease;
  background: #FFFFFF;
}

.back-link:hover {
  background: #1E3185;
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
  text-decoration: none;
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
div:has(> :contains("Loading poll...")) {
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
  
  .poll-detail h1 {
    font-size: 2rem;
  }
  
  .poll-options {
    padding: 2rem 1.5rem;
  }
  
  .option-button {
    padding: 1.2rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .option-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .poll-detail h1 {
    font-size: 1.8rem;
  }
  
  .poll-description {
    font-size: 1rem;
  }
  
  .poll-options {
    padding: 1.5rem 1rem;
  }
}
</style>