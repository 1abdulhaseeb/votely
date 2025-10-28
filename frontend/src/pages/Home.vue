<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span>🗳️ Modern Voting Platform</span>
          </div>
          <h1 class="hero-title">
            Create & Share
            <span class="highlight">Polls</span>
            That Matter
          </h1>
          <p class="hero-subtitle">
            Engage your audience with beautiful, interactive polls. 
            Get real-time results and insights that drive decisions.
          </p>
          <div class="hero-actions">
            <router-link to="/register" class="btn-primary">
              Get Started Free
              <span class="btn-icon">→</span>
            </router-link>
            <router-link to="/polls" class="btn-secondary">
              Browse Polls
            </router-link>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Polls Created</div>
            </div>
            <div class="stat">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Votes Cast</div>
            </div>
            <div class="stat">
              <div class="stat-number">2K+</div>
              <div class="stat-label">Active Users</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="poll-preview">
            <div class="poll-card">
              <h3>What's your favorite programming language?</h3>
              <div class="poll-options">
                <div class="poll-option">
                  <span>JavaScript</span>
                  <div class="progress-bar">
                    <div class="progress" style="width: 45%"></div>
                  </div>
                  <span class="percentage">45%</span>
                </div>
                <div class="poll-option">
                  <span>Python</span>
                  <div class="progress-bar">
                    <div class="progress" style="width: 30%"></div>
                  </div>
                  <span class="percentage">30%</span>
                </div>
                <div class="poll-option">
                  <span>TypeScript</span>
                  <div class="progress-bar">
                    <div class="progress" style="width: 25%"></div>
                  </div>
                  <span class="percentage">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2>Why Choose Votely?</h2>
          <p>Everything you need to create engaging polls and gather meaningful insights</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Create polls in seconds with our intuitive interface. No complex setup required.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Real-time Results</h3>
            <p>Watch responses come in live with beautiful charts and instant analytics.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security and privacy controls.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Perfect experience on any device - desktop, tablet, or mobile.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Brand your polls with custom colors, themes, and styling options.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Easy Sharing</h3>
            <p>Share your polls anywhere with direct links, QR codes, or social media.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users who trust Votely for their polling needs</p>
        <router-link to="/register" class="btn-cta">
          Create Your First Poll
          <span class="btn-icon">🎯</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Modern landing page for Votely
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  padding: 4rem 0 6rem;
  background: linear-gradient(135deg, #FFFFFF 0%, #f8f9ff 50%, #FFFFFF 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(30, 49, 133, 0.03) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(1deg); }
  66% { transform: translate(-20px, 20px) rotate(-1deg); }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  z-index: 2;
  position: relative;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.1) 0%, rgba(30, 49, 133, 0.05) 100%);
  color: #1E3185;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(30, 49, 133, 0.2);
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1E3185;
}

.highlight {
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(30, 49, 133, 0.7);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.4);
  background: linear-gradient(135deg, #162661 0%, #1E3185 100%);
}

.btn-secondary {
  background: #FFFFFF;
  color: #1E3185;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  border: 2px solid #1E3185;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #1E3185;
  color: #FFFFFF;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1E3185;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(30, 49, 133, 0.6);
  font-weight: 500;
  margin-top: 0.5rem;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.poll-preview {
  position: relative;
}

.poll-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(30, 49, 133, 0.15);
  border: 1px solid rgba(30, 49, 133, 0.1);
  max-width: 400px;
  animation: float-card 6s ease-in-out infinite;
}

@keyframes float-card {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.poll-card h3 {
  color: #1E3185;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.poll-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1E3185;
}

.poll-option span:first-child {
  min-width: 80px;
  font-size: 0.9rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(30, 49, 133, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.percentage {
  min-width: 40px;
  font-size: 0.9rem;
  font-weight: 700;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: #FFFFFF;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 3rem;
  font-weight: 800;
  color: #1E3185;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.2rem;
  color: rgba(30, 49, 133, 0.7);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(30, 49, 133, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 49, 133, 0.03), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(30, 49, 133, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E3185;
  margin-bottom: 1rem;
}

.feature-card p {
  color: rgba(30, 49, 133, 0.7);
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  text-align: center;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cta-section h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #FFFFFF;
}

.cta-section p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.btn-cta {
  background: #FFFFFF;
  color: #1E3185;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background: #f8f9ff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>
