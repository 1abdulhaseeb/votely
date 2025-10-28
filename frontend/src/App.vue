<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<style>
/* Reset some default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  margin: 0;
  display: block;
  min-height: 100vh;
}

#app {
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

/* Page styles */
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Form styles */
form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

form input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

form button:hover {
  background-color: #0056b3;
}

/* Override dark theme */
:root {
  color-scheme: light;
  color: #333;
  background-color: #ffffff;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

button {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
}

button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
