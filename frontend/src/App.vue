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
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #FFFFFF;
  color: #1E3185;
  margin: 0;
  display: block;
  min-height: 100vh;
  line-height: 1.6;
}

#app {
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 0;
  background: linear-gradient(135deg, #FFFFFF 0%, #f8f9ff 100%);
}

/* Page styles */
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Form styles */
form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(30, 49, 133, 0.12);
  border: 1px solid rgba(30, 49, 133, 0.1);
}

form input {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.25rem;
  border: 2px solid rgba(30, 49, 133, 0.15);
  border-radius: 8px;
  font-size: 1rem;
  color: #1E3185;
  background-color: #FFFFFF;
  transition: all 0.3s ease;
}

form input::placeholder {
  color: rgba(30, 49, 133, 0.5);
}

form input:focus {
  outline: none;
  border-color: #1E3185;
  box-shadow: 0 0 0 3px rgba(30, 49, 133, 0.15);
  transform: translateY(-1px);
}

form button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

form button:hover {
  background: linear-gradient(135deg, #162661 0%, #1E3185 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.3);
}

form button:active {
  transform: translateY(0);
}

form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Override dark theme */
:root {
  color-scheme: light;
  color: #1E3185;
  background-color: #FFFFFF;
}

a {
  color: #1E3185;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

a:hover {
  color: #162661;
  text-decoration: underline;
}

button {
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover {
  background: linear-gradient(135deg, #162661 0%, #1E3185 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  color: #1E3185;
  font-weight: 700;
  margin-bottom: 1rem;
}

h1 {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: 2.5rem;
}

p {
  color: rgba(30, 49, 133, 0.8);
  line-height: 1.7;
}
</style>
