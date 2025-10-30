<template>
  <div class="poll-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading poll...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <h2>❌ Error Loading Poll</h2>
      <p>{{ error }}</p>
      <router-link to="/polls" class="back-btn">← Back to Polls</router-link>
    </div>

    <!-- Poll Content -->
    <div v-else-if="poll" class="poll-content">
      <!-- Header -->
      <div class="poll-header">
        <div class="breadcrumb">
          <router-link to="/polls" class="breadcrumb-link">← Back to Polls</router-link>
        </div>
        
        <div class="poll-info">
          <h1>{{ poll.title }}</h1>
          <p class="poll-description">{{ poll.description }}</p>
          
          <div class="poll-meta">
            <span class="poll-type" :class="poll.pollType">
              {{ poll.pollType === 'candidate_based' ? 'Candidate Vote' : 'General Poll' }}
            </span>
            <span class="poll-status" :class="poll.status">{{ poll.status }}</span>
            <span class="poll-votes">{{ totalVotes }} {{ totalVotes === 1 ? 'vote' : 'votes' }}</span>
          </div>
        </div>
      </div>

      <!-- Voting Section -->
      <div v-if="poll.status === 'active' && !hasVoted && !userVote && authStore.user && authStore.user.role === 'voter'" class="voting-section">
        <h2>🗳️ Cast Your Vote</h2>
        <form @submit.prevent="submitVote" class="vote-form">
          <div class="options-list">
            <div 
              v-for="option in poll.options" 
              :key="option.id"
              class="option-item"
              :class="{ 'selected': selectedOption === option.id }"
            >
              <label class="option-label">
                <div class="option-radio">
                  <input 
                    type="radio" 
                    name="poll-option"
                    :value="option.id"
                    v-model="selectedOption"
                    :disabled="submittingVote"
                  />
                  <span class="radio-custom"></span>
                </div>
                <div class="option-content">
                  <span class="option-text">{{ option.optionText }}</span>
                  <span v-if="option.candidate" class="candidate-info">
                    by {{ option.candidate.firstName }} {{ option.candidate.lastName }}
                  </span>
                </div>
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="vote-btn"
            :disabled="!selectedOption || submittingVote"
          >
            <span v-if="submittingVote" class="btn-spinner"></span>
            {{ submittingVote ? 'Submitting Vote...' : '🗳️ Submit Vote' }}
          </button>
        </form>
      </div>

      <!-- Not Eligible to Vote Section -->
      <div v-else-if="poll.status === 'active' && (!authStore.user || authStore.user.role !== 'voter')" class="not-eligible-section">
        <div class="not-eligible-header">
          <h2>🔒 Voting Restricted</h2>
          <p v-if="!authStore.user">You must be logged in as a voter to participate in this poll.</p>
          <p v-else-if="authStore.user.role === 'admin'">Administrators cannot vote in polls.</p>
          <p v-else-if="authStore.user.role === 'candidate'">Candidates cannot vote in polls.</p>
          <router-link v-if="!authStore.user" to="/login" class="login-link">
            Login to Vote →
          </router-link>
        </div>
      </div>

      <!-- Already Voted Section - Show User's Choice -->
      <div v-else-if="(hasVoted || userVote) && authStore.user && authStore.user.role === 'voter'" class="voted-section">
        <div class="voted-header">
          <h2>✅ Your Vote Has Been Cast</h2>
          <p>Thank you for participating! Your vote has been recorded.</p>
          <div class="vote-locked-notice">
            <span class="lock-icon">🔒</span>
            <span>Vote is locked and cannot be changed</span>
          </div>
        </div>
        
        <!-- Show user's selected option -->
        <div class="user-vote-display">
          <!-- Show the stored selected option first -->
          <div v-if="userSelectedOption" class="user-choice">
            <h3>Your Choice:</h3>
            <div class="selected-option">
              <div class="option-indicator">
                <div class="check-icon">✓</div>
              </div>
              <div class="option-content">
                <span class="option-text">{{ userSelectedOption.optionText }}</span>
                <span v-if="userSelectedOption.candidate" class="candidate-info">
                  by {{ userSelectedOption.candidate.firstName }} {{ userSelectedOption.candidate.lastName }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Fallback to computed userVoteOption -->
          <div v-else-if="userVoteOption" class="user-choice">
            <h3>Your Choice:</h3>
            <div class="selected-option">
              <div class="option-indicator">
                <div class="check-icon">✓</div>
              </div>
              <div class="option-content">
                <span class="option-text">{{ userVoteOption.optionText }}</span>
                <span v-if="userVoteOption.candidate" class="candidate-info">
                  by {{ userVoteOption.candidate.firstName }} {{ userVoteOption.candidate.lastName }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Last resort: Show all options with user's vote highlighted -->
          <div v-else-if="userVote && poll.options" class="all-options-with-vote">
            <h3>Your Choice:</h3>
            <div class="options-display">
              <div 
                v-for="option in poll.options" 
                :key="option.id"
                class="display-option"
                :class="{ 'user-selected': userVote.optionId === option.id || parseInt(userVote.optionId) === parseInt(option.id) }"
              >
                <div class="option-indicator">
                  <div v-if="userVote.optionId === option.id || parseInt(userVote.optionId) === parseInt(option.id)" class="check-icon">✓</div>
                  <div v-else class="empty-circle"></div>
                </div>
                <div class="option-content">
                  <span class="option-text">{{ option.optionText }}</span>
                  <span v-if="option.candidate" class="candidate-info">
                    by {{ option.candidate.firstName }} {{ option.candidate.lastName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Poll Closed Message -->
      <div v-else-if="poll.status !== 'active'" class="closed-message">
        <h2>📊 Poll {{ poll.status === 'closed' ? 'Closed' : 'Not Active' }}</h2>
        <p>This poll is {{ poll.status }}. View the results below.</p>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="results-header">
          <h2>📊 Live Results</h2>
          <div class="total-votes">
            <strong>{{ totalVotes }}</strong> {{ totalVotes === 1 ? 'vote' : 'votes' }} cast
          </div>
        </div>
        
        <div v-if="results && results.length > 0" class="results-grid">
          <div 
            v-for="(result, index) in sortedResults" 
            :key="result.optionId"
            class="result-card"
            :class="{ 
              'winning': index === 0 && result.voteCount > 0,
              'user-voted': userVoteOption && userVoteOption.id === result.optionId 
            }"
          >
            <div class="result-header">
              <div class="result-rank" v-if="result.voteCount > 0">#{{ index + 1 }}</div>
              <div class="result-info">
                <h3 class="option-name">{{ result.optionText }}</h3>
                <div v-if="result.candidate" class="candidate-info">
                  by {{ result.candidate.firstName }} {{ result.candidate.lastName }}
                </div>
              </div>
              <div class="result-stats">
                <div class="vote-count">{{ result.voteCount }}</div>
                <div class="vote-label">{{ result.voteCount === 1 ? 'vote' : 'votes' }}</div>
              </div>
            </div>
            
            <div class="result-progress">
              <div class="result-bar">
                <div 
                  class="result-fill" 
                  :style="{ 
                    width: result.percentage + '%',
                    backgroundColor: getResultColor(index, result.voteCount > 0)
                  }"
                ></div>
              </div>
              <div class="result-percentage">{{ result.percentage.toFixed(1) }}%</div>
            </div>
            
            <!-- User vote indicator -->
            <div v-if="userVoteOption && userVoteOption.id === result.optionId" class="your-vote-badge">
              Your Vote ✓
            </div>
          </div>
        </div>
        
        <div v-else class="no-results">
          <div class="no-results-icon">📊</div>
          <h3>No votes yet</h3>
          <p>Be the first to cast your vote!</p>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="not-found-state">
      <h2>📊 Poll Not Found</h2>
      <p>The poll you're looking for doesn't exist or has been removed.</p>
      <router-link to="/polls" class="back-btn">← Back to Polls</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { pollAPI } from '../api/services';
import { useAuthStore } from '../stores/auth';
import type { Poll } from '../api/services';

const route = useRoute();
const authStore = useAuthStore();

// State
const poll = ref<Poll | null>(null);
const results = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedOption = ref<number | null>(null);
const submittingVote = ref(false);
const hasVoted = ref(false);
const userVote = ref<any>(null);
const userSelectedOption = ref<any>(null); // Store the actual option data

// Computed
const totalVotes = computed(() => {
  if (!results.value) return 0;
  return results.value.reduce((sum: number, result: any) => sum + result.voteCount, 0);
});

const sortedResults = computed(() => {
  if (!results.value) return [];
  return [...results.value].sort((a, b) => b.voteCount - a.voteCount);
});

const userVoteOption = computed(() => {
  if (!userVote.value || !poll.value?.options) return null;
  
  const voteOptionId = userVote.value.optionId;
  
  console.log('Finding user vote option:', {
    userVoteOptionId: voteOptionId,
    userVoteOptionIdType: typeof voteOptionId,
    pollOptions: poll.value.options.map((opt: any) => ({ id: opt.id, idType: typeof opt.id, text: opt.optionText })),
  });
  
  // Try both exact match and type-converted match
  let foundOption = poll.value.options.find((option: any) => option.id === voteOptionId);
  
  if (!foundOption) {
    // Try with number conversion
    foundOption = poll.value.options.find((option: any) => 
      parseInt(option.id) === parseInt(voteOptionId)
    );
  }
  
  console.log('Found option:', foundOption);
  return foundOption;
});

// Methods
async function fetchPoll() {
  try {
    loading.value = true;
    error.value = null;
    
    const pollId = parseInt(route.params.id as string);
    if (isNaN(pollId)) {
      throw new Error('Invalid poll ID');
    }

    const response = await pollAPI.getPoll(pollId);
    poll.value = response.data;
    
    // Fetch results
    await fetchResults();
    
    // Check if user has already voted (only if authenticated)
    if (authStore.user) {
      try {
        const voteResponse = await pollAPI.getMyVote(pollId);
        hasVoted.value = voteResponse.data.hasVoted;
        userVote.value = voteResponse.data.vote;
        
        // If user has voted, find and store the selected option
        if (userVote.value && poll.value?.options) {
          const selectedOptionData = poll.value.options.find((option: any) => 
            option.id === userVote.value.optionId || parseInt(option.id) === parseInt(userVote.value.optionId)
          );
          userSelectedOption.value = selectedOptionData;
        }
        
        console.log('User vote check response:', {
          hasVoted: voteResponse.data.hasVoted,
          vote: voteResponse.data.vote,
          selectedOption: userSelectedOption.value
        });
        
      } catch (err) {
        // Not authenticated or error checking vote - that's fine
        console.log('Could not check user vote:', err);
        hasVoted.value = false;
        userVote.value = null;
      }
    }
    
  } catch (err: any) {
    console.error('Error fetching poll:', err);
    error.value = err.response?.data?.message || 'Failed to load poll';
  } finally {
    loading.value = false;
  }
}

async function fetchResults() {
  try {
    const pollId = parseInt(route.params.id as string);
    const response = await pollAPI.getPollResults(pollId);
    const rawResults = response.data.results || response.data;
    
    // Calculate total votes first
    const total = rawResults.reduce((sum: number, result: any) => sum + result.voteCount, 0);
    
    results.value = rawResults.map((result: any) => ({
      ...result,
      percentage: total > 0 ? (result.voteCount / total) * 100 : 0
    }));
  } catch (err: any) {
    console.error('Error fetching results:', err);
  }
}

async function submitVote() {
  if (!selectedOption.value || !poll.value) return;
  
  // Double-check if user has already voted
  if (hasVoted.value || userVote.value) {
    alert('You have already voted in this poll.');
    return;
  }
  
  try {
    submittingVote.value = true;
    
    const pollId = parseInt(route.params.id as string);
    const response = await pollAPI.vote(pollId, selectedOption.value);
    
    // Find and store the selected option data
    const selectedOptionData = poll.value?.options?.find((option: any) => option.id === selectedOption.value);
    
    // Store user's vote with the selected option ID
    const voteData = {
      id: response.data.vote?.id || Date.now(),
      optionId: selectedOption.value,
      pollId: pollId,
      userId: authStore.user?.id || 0,
      createdAt: new Date().toISOString()
    };
    
    console.log('Storing vote data:', voteData);
    console.log('Selected option data:', selectedOptionData);
    
    userVote.value = voteData;
    userSelectedOption.value = selectedOptionData; // Store the actual option
    hasVoted.value = true;
    
    // Keep selected option for immediate display, clear after a delay
    setTimeout(() => {
      selectedOption.value = null;
    }, 1000);
    
    // Refresh results
    await fetchResults();
    
    // Show success message
    setTimeout(() => {
      const votedSection = document.querySelector('.voted-section');
      if (votedSection) {
        votedSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    
  } catch (err: any) {
    console.error('Error submitting vote:', err);
    const errorMessage = err.response?.data?.message || 'Failed to submit vote';
    
    // If user has already voted, update the state
    if (errorMessage.includes('already voted')) {
      hasVoted.value = true;
      // Try to fetch the user's existing vote
      try {
        const pollId = parseInt(route.params.id as string);
        const voteResponse = await pollAPI.getMyVote(pollId);
        userVote.value = voteResponse.data.vote;
        
        // Find and store the selected option
        if (userVote.value && poll.value?.options) {
          const selectedOptionData = poll.value.options.find((option: any) => 
            option.id === userVote.value.optionId || parseInt(option.id) === parseInt(userVote.value.optionId)
          );
          userSelectedOption.value = selectedOptionData;
        }
      } catch (fetchErr) {
        console.error('Error fetching existing vote:', fetchErr);
      }
    } else {
      alert(errorMessage);
    }
  } finally {
    submittingVote.value = false;
  }
}

function getResultColor(index: number, hasVotes: boolean) {
  if (!hasVotes) return '#e9ecef';
  
  const colors = [
    '#28a745', // Green for winner
    '#007bff', // Blue for second
    '#ffc107', // Yellow for third
    '#6c757d', // Gray for others
  ];
  
  return colors[Math.min(index, colors.length - 1)];
}

// Initialize
onMounted(() => {
  fetchPoll();
});
</script>

<style scoped>
.poll-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state, .not-found-state {
  text-align: center;
  padding: 60px 20px;
}

.error-state h2, .not-found-state h2 {
  color: #dc3545;
  margin-bottom: 10px;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #0056b3;
}

.poll-header {
  margin-bottom: 40px;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  margin-bottom: 20px;
  display: inline-block;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.poll-info h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #333;
}

.poll-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.poll-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.poll-type, .poll-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.poll-type.generic {
  background: #e3f2fd;
  color: #1976d2;
}

.poll-type.candidate_based {
  background: #f3e5f5;
  color: #7b1fa2;
}

.poll-status.active {
  background: #e8f5e8;
  color: #2e7d32;
}

.poll-status.closed {
  background: #ffebee;
  color: #c62828;
}

.poll-votes {
  color: #666;
  font-weight: 500;
}

.voting-section, .voted-section, .results-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e9ecef;
}

.voting-section h2, .results-section h2 {
  margin-bottom: 28px;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.options-list {
  margin-bottom: 32px;
}

.option-item {
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.option-item.selected {
  transform: translateY(-2px);
}

.option-label {
  display: flex;
  align-items: center;
  padding: 24px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  min-height: 80px;
  gap: 20px;
}

.option-label:hover {
  border-color: #007bff;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0,123,255,0.1);
}

.option-item.selected .option-label {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
  box-shadow: 0 4px 16px rgba(0,123,255,0.15);
}

.option-radio {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  flex-shrink: 0;
}

.option-radio input[type="radio"] {
  opacity: 0;
  position: absolute;
  width: 28px;
  height: 28px;
  margin: 0;
  cursor: pointer;
  z-index: 1;
}

.radio-custom {
  width: 28px;
  height: 28px;
  border: 3px solid #dee2e6;
  border-radius: 50%;
  background: white;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-radio input[type="radio"]:checked + .radio-custom {
  border-color: #007bff;
  background: #007bff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.option-radio input[type="radio"]:checked + .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: radioCheck 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes radioCheck {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.option-radio input[type="radio"]:hover + .radio-custom {
  border-color: #007bff;
  box-shadow: 0 3px 8px rgba(0,123,255,0.2);
}

.option-radio input[type="radio"]:disabled + .radio-custom {
  border-color: #ced4da;
  background: #f8f9fa;
  cursor: not-allowed;
  box-shadow: none;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 32px;
}

.option-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 6px;
  line-height: 1.4;
}

.candidate-info {
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
  line-height: 1.3;
}

.vote-btn {
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(30, 49, 133, 0.25);
  position: relative;
  overflow: hidden;
}

.vote-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2C4AAF 0%, #3B5FD9 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(30, 49, 133, 0.4);
}

.vote-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
}

.vote-btn:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
}

.vote-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.vote-btn:hover:not(:disabled)::before {
  left: 100%;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.not-eligible-section {
  background: linear-gradient(135deg, #fff8f0 0%, #ffeaa7 100%);
  border: 2px solid #f39c12;
  text-align: center;
}

.not-eligible-header h2 {
  color: #e67e22;
  margin-bottom: 12px;
  font-size: 1.4rem;
}

.not-eligible-header p {
  color: #d35400;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.login-link {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.login-link:hover {
  background: linear-gradient(135deg, #2980b9 0%, #1f4e79 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.voted-section {
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
  border-color: #28a745;
}

.voted-header {
  text-align: center;
  margin-bottom: 24px;
}

.voted-header h2 {
  color: #28a745;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.voted-header p {
  color: #155724;
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.vote-locked-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  color: #856404;
  font-size: 0.95rem;
  font-weight: 500;
}

.lock-icon {
  font-size: 1.1rem;
}

.user-choice h3, .all-options-with-vote h3 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.2rem;
}

.selected-option {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border: 2px solid #28a745;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(40,167,69,0.15);
}

.option-indicator {
  margin-right: 16px;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.options-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.display-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.display-option.user-selected {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
  box-shadow: 0 2px 8px rgba(40,167,69,0.15);
}

.display-option .option-indicator {
  margin-right: 16px;
}

.empty-circle {
  width: 24px;
  height: 24px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  background: white;
}

.closed-message {
  text-align: center;
  padding: 30px;
  margin-bottom: 30px;
  background: #f8f9fa;
  border-radius: 10px;
}

.closed-message h2 {
  color: #6c757d;
}



.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
}

.results-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.total-votes {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 12px 20px;
  border-radius: 25px;
  color: #495057;
  font-size: 1rem;
  border: 1px solid #dee2e6;
}

.results-grid {
  display: grid;
  gap: 16px;
}

.result-card {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.result-card.winning {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
  box-shadow: 0 4px 16px rgba(40,167,69,0.15);
}

.result-card.user-voted {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  box-shadow: 0 4px 16px rgba(0,123,255,0.15);
}

.result-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.result-rank {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.result-card.winning .result-rank {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
}

.result-info {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 4px;
  line-height: 1.3;
}

.result-stats {
  text-align: right;
  flex-shrink: 0;
}

.vote-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.vote-label {
  font-size: 0.85rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-progress {
  margin-top: 16px;
}

.result-bar {
  height: 12px;
  background: #f1f3f4;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.result-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.result-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.result-percentage {
  text-align: right;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 600;
}

.your-vote-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.7;
}

.no-results h3 {
  color: #495057;
  margin-bottom: 8px;
  font-size: 1.3rem;
}

.no-results p {
  font-size: 1.1rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .poll-detail {
    padding: 15px;
  }
  
  .poll-info h1 {
    font-size: 2rem;
  }
  
  .voting-section, .results-section {
    padding: 20px;
  }
  
  .poll-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .option-label {
    padding: 20px 16px;
    gap: 16px;
    min-height: 70px;
  }
  
  .option-radio {
    min-width: 28px;
    min-height: 28px;
  }
  
  .radio-custom {
    width: 24px;
    height: 24px;
  }
  
  .option-radio input[type="radio"] {
    width: 24px;
    height: 24px;
  }
}
</style>
