<template>
  <div class="poll-detail">
    <h1>Poll Detail</h1>
    <p>Poll ID: {{ $route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">
// Minimal poll detail page
</script>

<style scoped>
.poll-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
