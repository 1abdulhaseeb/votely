<template>
  <div class="create-poll-page">
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/polls" class="breadcrumb-link">← Back to Polls</router-link>
      </div>
      <h1>Create New Poll</h1>
      <p>Design a poll to gather opinions and votes from your community</p>
    </div>

    <form @submit.prevent="createPoll" class="poll-form">
      <!-- Basic Information -->
      <div class="form-section">
        <h2>Basic Information</h2>
        
        <div class="form-group">
          <label for="title">Poll Title *</label>
          <input 
            id="title"
            v-model="formData.title" 
            type="text" 
            placeholder="Enter a compelling poll title"
            required
            maxlength="200"
          />
          <small class="field-hint">{{ formData.title.length }}/200 characters</small>
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            id="description"
            v-model="formData.description" 
            placeholder="Provide context and details about this poll"
            rows="4"
            required
            maxlength="1000"
          ></textarea>
          <small class="field-hint">{{ formData.description.length }}/1000 characters</small>
        </div>
      </div>

      <!-- Poll Settings -->
      <div class="form-section">
        <h2>Poll Settings</h2>
        
        <div class="form-group">
          <label for="pollType">Poll Type *</label>
          <select id="pollType" v-model="formData.pollType" required>
            <option value="generic">Generic Poll</option>
            <option value="candidate_based">Candidate-Based Poll</option>
          </select>
          <small class="field-hint">
            <span v-if="formData.pollType === 'generic'">
              Standard poll with custom options
            </span>
            <span v-else>
              Poll where options represent candidates
            </span>
          </small>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="formData.allowMultipleVotes"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            Allow Multiple Votes
          </label>
          <small class="field-hint">Voters can select more than one option if enabled</small>
        </div>
      </div>

      <!-- Poll Options -->
      <div class="form-section">
        <h2>Poll Options</h2>
        <p class="section-description">Add at least 2 options for your poll</p>
        
        <!-- Generic Poll Options -->
        <div v-if="formData.pollType === 'generic'" class="options-container">
          <div 
            v-for="(option, index) in formData.options" 
            :key="index" 
            class="option-input-group"
          >
            <div class="option-header">
              <label :for="`option-${index}`">Option {{ index + 1 }}</label>
              <button 
                v-if="formData.options.length > 2" 
                type="button"
                @click="removeOption(index)"
                class="remove-option-btn"
              >
                ✕
              </button>
            </div>
            <input 
              :id="`option-${index}`"
              v-model="option.optionText" 
              type="text" 
              :placeholder="`Enter option ${index + 1}`"
              required
              maxlength="200"
            />
          </div>
          
          <button 
            type="button" 
            @click="addOption"
            class="add-option-btn"
            :disabled="formData.options.length >= 10"
          >
            ➕ Add Option
          </button>
          <small class="field-hint">Maximum 10 options allowed</small>
        </div>

        <!-- Candidate-Based Poll Options -->
        <div v-else class="candidates-container">
          <div v-if="candidatesLoading" class="loading-state">
            <div class="loading-spinner small"></div>
            <p>Loading candidates...</p>
          </div>
          
          <div v-else-if="availableCandidates.length === 0" class="no-candidates">
            <!-- Debug info when no candidates -->
            <div style="background: #f0f0f0; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
              <small>Debug: Available candidates count: {{ availableCandidates.length }}</small>
              <br>
              <small>Candidates loading: {{ candidatesLoading }}</small>
              <br>
              <small>Candidates error: {{ candidatesError }}</small>
            </div>
            <div class="no-candidates-icon">👥</div>
            <h3>No Candidates Available</h3>
            <p>You need to promote some users to candidates first.</p>
            <router-link to="/admin/users" class="manage-users-link">
              Manage Users
            </router-link>
          </div>
          
          <div v-else class="candidate-selection">
            <p class="selection-hint">Select candidates to include in this poll:</p>
            <div class="candidates-grid">
              <label 
                v-for="candidate in availableCandidates" 
                :key="candidate.id"
                class="candidate-option"
              >
                <input 
                  type="checkbox" 
                  :value="candidate.id"
                  v-model="selectedCandidates"
                  class="candidate-checkbox"
                />
                <div class="candidate-card">
                  <div class="candidate-info">
                    <h4>{{ candidate.firstName }} {{ candidate.lastName }}</h4>
                    <p>@{{ candidate.username }}</p>
                  </div>
                  <div class="candidate-email">{{ candidate.email }}</div>
                </div>
              </label>
            </div>
            <small class="field-hint">Selected: {{ selectedCandidates.length }} candidates</small>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <router-link to="/polls" class="cancel-btn">Cancel</router-link>
        <button 
          type="button" 
          @click="saveDraft"
          class="draft-btn"
          :disabled="!canSave || saving"
        >
          {{ saving && isDraft ? 'Saving Draft...' : 'Save as Draft' }}
        </button>
        <button 
          type="submit"
          class="create-btn"
          :disabled="!canSave || saving"
        >
          {{ saving && !isDraft ? 'Creating...' : 'Create & Activate Poll' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePollsStore } from '../stores/polls';
import { useAuthStore } from '../stores/auth';
import type { User } from '../api/services';

const router = useRouter();
const pollsStore = usePollsStore();
const authStore = useAuthStore();

// Check if user is admin
const isAdmin = computed(() => authStore.user?.role === 'admin');

// Redirect if not admin
if (!isAdmin.value) {
  router.push('/polls');
}

const formData = reactive({
  title: '',
  description: '',
  pollType: 'generic' as 'generic' | 'candidate_based',
  allowMultipleVotes: false,
  options: [
    { optionText: '', candidateId: undefined },
    { optionText: '', candidateId: undefined }
  ]
});

const selectedCandidates = ref<number[]>([]);
const availableCandidates = ref<User[]>([]);
const candidatesLoading = ref(false);
const candidatesError = ref<string | null>(null);

const saving = ref(false);
const isDraft = ref(false);

// Computed
const canSave = computed(() => {
  if (!formData.title.trim() || !formData.description.trim()) return false;
  
  if (formData.pollType === 'generic') {
    return formData.options.length >= 2 && 
           formData.options.every(option => option.optionText.trim());
  } else {
    return selectedCandidates.value.length >= 2;
  }
});

// Methods
function addOption() {
  if (formData.options.length < 10) {
    formData.options.push({ optionText: '', candidateId: undefined });
  }
}

function removeOption(index: number) {
  if (formData.options.length > 2) {
    formData.options.splice(index, 1);
  }
}

async function loadCandidates() {
  candidatesLoading.value = true;
  candidatesError.value = null;
  
  console.log('Token in localStorage:', localStorage.getItem('token'));
  console.log('Making API call to fetch candidates...');
  
  try {
    const candidates = await pollsStore.fetchCandidates();
    console.log('Loaded candidates:', candidates);
    availableCandidates.value = candidates;
  } catch (error: any) {
    console.error('Error loading candidates:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    candidatesError.value = error.response?.data?.message || 'Failed to load candidates';
  } finally {
    candidatesLoading.value = false;
  }
}

async function createPoll() {
  await submitPoll(false);
}

async function saveDraft() {
  await submitPoll(true);
}

async function submitPoll(draft: boolean) {
  if (!canSave.value || saving.value) return;
  
  saving.value = true;
  isDraft.value = draft;
  
  try {
    let options;
    
    if (formData.pollType === 'generic') {
      options = formData.options.map(option => ({
        optionText: option.optionText.trim(),
        candidateId: undefined
      }));
    } else {
      options = selectedCandidates.value.map(candidateId => {
        const candidate = availableCandidates.value.find(c => c.id === candidateId);
        return {
          optionText: `${candidate?.firstName} ${candidate?.lastName}`.trim(),
          candidateId: candidateId
        };
      });
    }
    
    const pollData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      pollType: formData.pollType,
      allowMultipleVotes: formData.allowMultipleVotes,
      options
    };
    
    const newPoll = await pollsStore.createPoll(pollData);
    
    // If creating as draft, navigate to poll detail for further editing
    // If creating as active, activate it first then navigate
    if (!draft) {
      await pollsStore.updatePollStatus(newPoll.poll.id, 'active');
    }
    
    router.push(`/poll/${newPoll.poll.id}`);
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to create poll. Please try again.');
  } finally {
    saving.value = false;
    isDraft.value = false;
  }
}

// Lifecycle
onMounted(() => {
  // Always load candidates on mount so they're available when needed
  loadCandidates();
});

// Watch poll type changes
import { watch } from 'vue';
watch(() => formData.pollType, (newType) => {
  if (newType === 'candidate_based') {
    loadCandidates();
  }
});
</script>

<style scoped>
.create-poll-page {
  max-width: 100%;
  width: 100%;
  margin: 0;
  padding: 0.25rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  border-radius: 2px;
}

.breadcrumb {
  margin-bottom: 0.75rem;
  text-align: left;
}

.breadcrumb-link {
  color: #1E3185;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(30, 49, 133, 0.05);
  border: 1px solid rgba(30, 49, 133, 0.1);
}

.breadcrumb-link:hover {
  background: rgba(30, 49, 133, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 49, 133, 0.15);
}

.page-header h1 {
  color: #1E3185;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.poll-form {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(30, 49, 133, 0.1);
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(30, 49, 133, 0.12);
  position: relative;
  width: 50%;
  max-width: none;
}

.poll-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 50%, #3B5FD9 100%);
}

.form-section {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(30, 49, 133, 0.08);
  position: relative;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section:nth-child(even) {
  background: rgba(30, 49, 133, 0.02);
}

.form-section h2 {
  color: #1E3185;
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-section h2::before {
  content: '';
  width: 40px;
  height: 4px;
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  border-radius: 2px;
}

.section-description {
  color: rgba(30, 49, 133, 0.7);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: #1E3185;
  font-weight: 700;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  position: relative;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(30, 49, 133, 0.12);
  border-radius: 10px;
  font-size: 1rem;
  color: #1E3185;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.form-group input:hover,
.form-group textarea:hover,
.form-group select:hover {
  border-color: rgba(30, 49, 133, 0.25);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1E3185;
  box-shadow: 0 0 0 4px rgba(30, 49, 133, 0.15), 0 8px 25px rgba(30, 49, 133, 0.1);
  background: white;
  transform: translateY(-2px);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.field-hint {
  display: block;
  color: rgba(30, 49, 133, 0.6);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-group .checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(30, 49, 133, 0.3);
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  background: white;
}

.checkbox-input:checked + .checkbox-custom {
  background: #1E3185;
  border-color: #1E3185;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1;
}

.options-container {
  margin-top: 1rem;
}

.option-input-group {
  margin-bottom: 1rem;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.option-header label {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.remove-option-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.remove-option-btn:hover {
  background: #dc2626;
}

.add-option-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.05) 0%, rgba(30, 49, 133, 0.1) 100%);
  color: #1E3185;
  border: 2px dashed rgba(30, 49, 133, 0.25);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1rem;
  width: 100%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-option-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.1) 0%, rgba(30, 49, 133, 0.15) 100%);
  border-color: #1E3185;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.2);
}

.add-option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.candidates-container {
  margin-top: 1rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
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

.loading-spinner.small {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-candidates {
  text-align: center;
  padding: 2rem;
  color: rgba(30, 49, 133, 0.7);
}

.no-candidates-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-candidates h3 {
  color: #1E3185;
  margin-bottom: 0.5rem;
}

.manage-users-link {
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

.manage-users-link:hover {
  background: #162661;
}

.candidate-selection {
  margin-top: 1rem;
}

.selection-hint {
  color: rgba(30, 49, 133, 0.7);
  margin-bottom: 1rem;
}

.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.candidate-option {
  cursor: pointer;
}

.candidate-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.candidate-card {
  padding: 1.5rem;
  border: 2px solid rgba(30, 49, 133, 0.12);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.candidate-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.candidate-checkbox:checked + .candidate-card {
  border-color: #1E3185;
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.05) 0%, rgba(30, 49, 133, 0.08) 100%);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.15);
}

.candidate-checkbox:checked + .candidate-card::before {
  transform: scaleX(1);
}

.candidate-card:hover {
  border-color: #1E3185;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.2);
}

.candidate-info h4 {
  color: #1E3185;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.candidate-info p {
  color: rgba(30, 49, 133, 0.7);
  margin-bottom: 0.5rem;
}

.candidate-email {
  color: rgba(30, 49, 133, 0.6);
  font-size: 0.9rem;
}

.form-actions {
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.02) 0%, rgba(30, 49, 133, 0.05) 100%);
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  border-top: 1px solid rgba(30, 49, 133, 0.08);
}

.cancel-btn,
.draft-btn,
.create-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.cancel-btn {
  background: rgba(30, 49, 133, 0.08);
  color: #1E3185;
  border: 2px solid rgba(30, 49, 133, 0.15);
}

.cancel-btn:hover {
  background: rgba(30, 49, 133, 0.12);
  border-color: rgba(30, 49, 133, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.15);
}

.draft-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #e0a800 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.draft-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800 0%, #d97706 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.create-btn {
  background: linear-gradient(135deg, #1E3185 0%, #2C4AAF 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
}

.create-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2C4AAF 0%, #3B5FD9 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 49, 133, 0.4);
}

.draft-btn::before,
.create-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.draft-btn:hover::before,
.create-btn:hover::before {
  left: 100%;
}

.draft-btn:disabled,
.create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1600px) {
  .create-poll-page {
    max-width: 96%;
    width: 96%;
  }
}

@media (max-width: 1200px) {
  .create-poll-page {
    max-width: 97%;
    width: 97%;
  }
}

@media (max-width: 1024px) {
  .create-poll-page {
    padding: 0.5rem;
    max-width: 98%;
    width: 98%;
  }
  
  .candidates-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .create-poll-page {
    padding: 0.3rem;
    max-width: 99%;
    width: 99%;
  }
  
  .candidates-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
    margin: 0.25rem 0;
  }
}

@media (max-width: 480px) {
  .create-poll-page {
    padding: 0.2rem;
    max-width: 100%;
    width: 100%;
    margin: 0;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .form-section {
    padding: 0.75rem;
  }
  
  .form-actions {
    padding: 0.75rem;
  }
  
  .breadcrumb {
    margin-bottom: 0.5rem;
  }
}
</style>