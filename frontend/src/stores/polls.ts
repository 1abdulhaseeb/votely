import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { pollAPI, candidatesAPI, type Poll, type PollResult, type User } from '../api/services';

export const usePollsStore = defineStore('polls', () => {
  const polls = ref<Poll[]>([]);
  const currentPoll = ref<Poll | null>(null);
  const pollResults = ref<PollResult[]>([]);
  const candidates = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const activePolls = computed(() => polls.value.filter(poll => poll.status === 'active'));
  const draftPolls = computed(() => polls.value.filter(poll => poll.status === 'draft'));
  const closedPolls = computed(() => polls.value.filter(poll => poll.status === 'closed'));

  // Actions
  async function fetchPolls() {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.getAllPolls();
      polls.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch polls';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPoll(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.getPoll(id);
      currentPoll.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch poll';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createPoll(pollData: {
    title: string;
    description: string;
    pollType: 'candidate_based' | 'generic';
    allowMultipleVotes?: boolean;
    options: Array<{
      optionText: string;
      candidateId?: number;
    }>;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.createPoll(pollData);
      await fetchPolls(); // Refresh polls list
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create poll';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function vote(pollId: number, optionId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.vote(pollId, optionId);
      // Refresh current poll if it's the same one
      if (currentPoll.value?.id === pollId) {
        await fetchPoll(pollId);
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to vote';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPollResults(pollId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.getPollResults(pollId);
      pollResults.value = response.data.results;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch results';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePollStatus(pollId: number, status: 'draft' | 'active' | 'closed') {
    loading.value = true;
    error.value = null;
    try {
      const response = await pollAPI.updatePollStatus(pollId, status);
      await fetchPolls(); // Refresh polls list
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update poll status';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCandidates() {
    loading.value = true;
    error.value = null;
    try {
      const response = await candidatesAPI.getAllCandidates();
      candidates.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch candidates';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function promoteToCandidate(userId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await candidatesAPI.promoteToCandidate(userId);
      await fetchCandidates(); // Refresh candidates list
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to promote user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentPoll() {
    currentPoll.value = null;
    pollResults.value = [];
  }

  return {
    // State
    polls,
    currentPoll,
    pollResults,
    candidates,
    loading,
    error,
    
    // Computed
    activePolls,
    draftPolls,
    closedPolls,
    
    // Actions
    fetchPolls,
    fetchPoll,
    createPoll,
    vote,
    fetchPollResults,
    updatePollStatus,
    fetchCandidates,
    promoteToCandidate,
    clearError,
    clearCurrentPoll,
  };
});