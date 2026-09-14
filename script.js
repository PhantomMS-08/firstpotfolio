/**
 * ===================================================================
 * MANU SHARMA — AI ENGINEER PORTFOLIO
 * Core JavaScript: Interactive Systems, Canvas Engine, Demos & Telemetry
 * Pure Vanilla JavaScript (ES6+)
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypewriter();
  initHeroTilt();
  initProjectFilters();
  initInteractiveDemos();
  initArchitectureModals();
  initContactFormAndClipboard();
  initNavigationAndScroll();
});

/* ===================================================================
   1. INTERACTIVE NEURAL CONSTELLATION CANVAS
=================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 85);
  const connectionDistance = 140;
  const mouse = { x: null, y: null, radius: 160 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseRadius = Math.random() * 1.8 + 1.2;
      this.radius = this.baseRadius;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254,' : 'rgba(168, 85, 247,';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off borders
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity: gentle attraction/swirl
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
          this.radius = this.baseRadius * 1.6;
        } else {
          this.radius = this.baseRadius;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Populate particles
  particles = Array.from({ length: particleCount }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect near neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. TYPEWRITER EFFECT IN HERO SECTION
=================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typewriterText');
  if (!textElement) return;

  const phrases = [
    'Designing & Training Machine Learning Models',
    'Natural Language Processing (NLP) & LLMs',
    'High-Precision Computer Vision Pipelines',
    'Scalable Cloud Deployments & MLOps',
    'AI-Driven Automation & Optimization'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   3. HERO 3D CARD PARALLAX TILT
=================================================================== */
function initHeroTilt() {
  const card = document.getElementById('hero3DCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ===================================================================
   4. PROJECT CATEGORY FILTERS
=================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease-out';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===================================================================
   5. INTERACTIVE LIVE DEMOS (CHATBOT, CV, FORECASTING)
=================================================================== */
function initInteractiveDemos() {
  // Demo Tab Switching
  const demoTabs = document.querySelectorAll('.demo-tab-btn');
  const demoContents = document.querySelectorAll('.demo-content');

  demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      demoTabs.forEach(t => t.classList.remove('active'));
      demoContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        if (targetId === 'forecast-demo') {
          drawForecastChart();
        }
      }
    });
  });

  // --- TAB 1: Chatbot Simulation ---
  const chatMessages = document.getElementById('chatMessages');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  const botResponses = {
    latency: "⚡ Latency Benchmark: Our production NLP inference engine delivers an average latency of 14ms on GPU instances and sub-45ms on edge CPU containers via INT8 quantization and TensorRT runtime.",
    specializations: "🧠 Manu specializes in: 1) Designing bespoke ML architectures, 2) NLP & Computer Vision pipelines, 3) AI-driven automation/optimization, and 4) Production MLOps on AWS, Azure, and GCP.",
    support: "💼 Support Flow: The Chatbot employs hierarchical intent classification combined with hybrid vector similarity search (Dense embeddings + BM25). Ambiguous queries are automatically clustered or routed to human escalation agents with zero context loss.",
    quality: "🎯 Production Quality: We maintain 95%+ accuracy through automated regression tests, continuous drift monitoring via MLflow/Prometheus, and dynamic confidence thresholds that prevent hallucinations.",
    default: "🤖 Thank you for your inquiry! As an AI system engineered by Manu Sharma, I can assist you with NLP architectures, computer vision models, time-series forecasting, and cloud deployment pipelines. What specific challenge are you solving?"
  };

  function appendChatMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-msg' : 'bot-msg'}`;

    const sender = document.createElement('span');
    sender.className = 'msg-sender';
    sender.textContent = isUser ? 'You:' : 'SupportBot (Inference API):';

    const content = document.createElement('p');
    content.textContent = text;

    msgDiv.appendChild(sender);
    msgDiv.appendChild(content);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserQuery(query) {
    if (!query.trim()) return;
    appendChatMessage(query, true);

    // Simulated Bot Typing Delay
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-msg';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = '<span class="msg-sender">SupportBot:</span><p style="font-style:italic; opacity:0.8;">Analyzing intent with NLP transformer...</p>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();

      const lower = query.toLowerCase();
      let response = botResponses.default;

      if (lower.includes('latency') || lower.includes('speed') || lower.includes('fast')) {
        response = botResponses.latency;
      } else if (lower.includes('specializ') || lower.includes('models') || lower.includes('skills')) {
        response = botResponses.specializations;
      } else if (lower.includes('support') || lower.includes('customer') || lower.includes('flow')) {
        response = botResponses.support;
      } else if (lower.includes('accuracy') || lower.includes('quality') || lower.includes('precision')) {
        response = botResponses.quality;
      }

      appendChatMessage(response, false);
    }, 650);
  }

  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value;
      chatInput.value = '';
      handleUserQuery(val);
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleUserQuery(chip.dataset.prompt);
    });
  });

  // --- TAB 2: Computer Vision Inspector Controls ---
  const thresholdSlider = document.getElementById('thresholdSlider');
  const thresholdVal = document.getElementById('thresholdVal');
  const bboxes = document.querySelectorAll('.bbox');
  const toggleBBoxesBtn = document.getElementById('toggleBBoxesBtn');
  const simulateNextFrameBtn = document.getElementById('simulateNextFrameBtn');

  if (thresholdSlider && thresholdVal) {
    thresholdSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      thresholdVal.textContent = (val / 100).toFixed(2);

      // Hide or show boxes based on mock confidence
      bboxes.forEach(box => {
        if (box.classList.contains('bbox-car')) {
          box.style.display = (val <= 95) ? 'block' : 'none';
        } else if (box.classList.contains('bbox-pedestrian')) {
          box.style.display = (val <= 95) ? 'block' : 'none';
        } else if (box.classList.contains('bbox-bus')) {
          box.style.display = (val <= 96) ? 'block' : 'none';
        }
      });
    });
  }

  let boxesVisible = true;
  if (toggleBBoxesBtn) {
    toggleBBoxesBtn.addEventListener('click', () => {
      boxesVisible = !boxesVisible;
      bboxes.forEach(box => {
        box.style.display = boxesVisible ? 'block' : 'none';
      });
      toggleBBoxesBtn.textContent = boxesVisible ? 'Hide Overlays' : 'Show Overlays';
      showToast(boxesVisible ? 'Bounding overlays enabled' : 'Bounding overlays disabled');
    });
  }

  if (simulateNextFrameBtn) {
    simulateNextFrameBtn.addEventListener('click', () => {
      const viewport = document.getElementById('cvViewport');
      if (viewport) {
        viewport.style.opacity = '0.7';
        setTimeout(() => {
          viewport.style.opacity = '1';
          showToast('Frame #2984 ingested &bull; Zero dropouts');
        }, 200);
      }
    });
  }

  // --- TAB 3: Predictive Analytics Canvas Chart ---
  initForecastChart();
}

/* ===================================================================
   6. FORECAST CHART SIMULATION (CANVAS)
=================================================================== */
let forecastData = {
  historical: [110, 125, 118, 142, 135, 160, 155, 178, 170, 192],
  future: [205, 222, 238, 255, 272],
  confidenceUpper: [215, 236, 256, 277, 298],
  confidenceLower: [195, 208, 220, 233, 246]
};

function initForecastChart() {
  const canvas = document.getElementById('forecastCanvas');
  if (!canvas) return;

  const reforecastBtn = document.getElementById('reforecastBtn');
  if (reforecastBtn) {
    reforecastBtn.addEventListener('click', () => {
      // Perturbate predictions slightly to demonstrate live recalculation
      const offset = (Math.random() - 0.5) * 20;
      forecastData.future = forecastData.future.map((v, i) => Math.round(v + (i + 1) * (offset / 3)));
      forecastData.confidenceUpper = forecastData.future.map(v => Math.round(v + 22));
      forecastData.confidenceLower = forecastData.future.map(v => Math.round(v - 22));
      drawForecastChart();
      showToast('Recalculated 95% Confidence Interval Forecast');
    });
  }

  window.addEventListener('resize', drawForecastChart);
  setTimeout(drawForecastChart, 300);
}

function drawForecastChart() {
  const canvas = document.getElementById('forecastCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 220;

  const w = canvas.width;
  const h = canvas.height;
  const padding = { top: 25, right: 35, bottom: 35, left: 45 };

  ctx.clearRect(0, 0, w, h);

  const totalPoints = forecastData.historical.length + forecastData.future.length;
  const stepX = (w - padding.left - padding.right) / (totalPoints - 1);
  const maxVal = 320;
  const minVal = 80;

  function getY(val) {
    return h - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (h - padding.top - padding.bottom);
  }

  // Draw Grid Lines & Y-Axis Labels
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';

  for (let val = 100; val <= 300; val += 50) {
    const y = getY(val);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillText(`$${val}k`, 8, y + 4);
  }

  // 1. Draw Confidence Interval Area (Shaded Band)
  const splitIdx = forecastData.historical.length - 1;
  const splitX = padding.left + splitIdx * stepX;
  const splitY = getY(forecastData.historical[splitIdx]);

  ctx.beginPath();
  ctx.moveTo(splitX, splitY);

  // Upper boundary
  for (let i = 0; i < forecastData.confidenceUpper.length; i++) {
    const x = splitX + (i + 1) * stepX;
    const y = getY(forecastData.confidenceUpper[i]);
    ctx.lineTo(x, y);
  }

  // Lower boundary backwards
  for (let i = forecastData.confidenceLower.length - 1; i >= 0; i--) {
    const x = splitX + (i + 1) * stepX;
    const y = getY(forecastData.confidenceLower[i]);
    ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
  ctx.fill();

  // 2. Draw Historical Line (Cyan/Blue)
  ctx.beginPath();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  for (let i = 0; i < forecastData.historical.length; i++) {
    const x = padding.left + i * stepX;
    const y = getY(forecastData.historical[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw historical points
  for (let i = 0; i < forecastData.historical.length; i++) {
    const x = padding.left + i * stepX;
    const y = getY(forecastData.historical[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#080c14';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }

  // 3. Draw Predicted Line (Violet/Purple)
  ctx.beginPath();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 5]);
  ctx.moveTo(splitX, splitY);
  for (let i = 0; i < forecastData.future.length; i++) {
    const x = splitX + (i + 1) * stepX;
    const y = getY(forecastData.future[i]);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // Draw prediction points
  for (let i = 0; i < forecastData.future.length; i++) {
    const x = splitX + (i + 1) * stepX;
    const y = getY(forecastData.future[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#a855f7';
    ctx.fill();
  }

  // Draw "Today / Inference Cutoff" indicator line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.moveTo(splitX, padding.top);
  ctx.lineTo(splitX, h - padding.bottom);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'var(--accent-cyan)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText('LIVE STREAM CUTOFF', splitX - 55, padding.top - 8);
}

/* ===================================================================
   7. PROJECT ARCHITECTURE MODALS
=================================================================== */
function initArchitectureModals() {
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  const openDetailBtns = document.querySelectorAll('.open-details-btn');
  const openDemoBtns = document.querySelectorAll('.open-demo-btn');

  const projectDetails = {
    chatbot: {
      title: "Smart Chatbot System",
      category: "Natural Language Processing (NLP) & Conversational AI",
      image: "assets/images/project-chatbot.jpg",
      description: "An intelligent, multi-turn conversational support agent engineered to automate enterprise customer support inquiries with sub-50ms inference latency.",
      architecture: `[Client UI / Widget]
        │
        ▼ (HTTPS / WebSocket)
[FastAPI Gateway & Auth]
        │
        ├─► [Bi-Encoder Semantic Search] ──► [Milvus / Qdrant Vector DB]
        │
        ├─► [Cross-Encoder Re-Ranking]
        │
        ▼
[Fine-Tuned LLM (PyTorch / ONNX Runtime)] ──► [Contextual Response Generator]`,
      keyFeatures: [
        "Hybrid dense-sparse retrieval combining embeddings with BM25 indexing.",
        "Low-latency response caching layer cutting redundant compute by 42%.",
        "Configurable confidence scoring threshold to prevent hallucinations.",
        "Seamless escalation pipeline that triggers human agent hand-offs with full context transcripts."
      ],
      metrics: "Sub-50ms inference latency &bull; 98.4% classification intent accuracy"
    },
    vision: {
      title: "Image Recognition Pipeline",
      category: "Computer Vision & Edge Optimization",
      image: "assets/images/project-vision.jpg",
      description: "High-throughput visual recognition engine built with PyTorch and YOLOv8, trained on multi-class datasets and quantized for real-time edge execution.",
      architecture: `[Video Stream / RTSP Ingest]
        │
        ▼
[CUDA Preprocessing & Normalization]
        │
        ▼
[YOLOv8 Feature Extractor (Backbone + FPN)]
        │
        ▼
[TensorRT INT8 Quantized Inference Engine]
        │
        ├─► Non-Maximum Suppression (NMS)
        ├─► Dynamic Bounding Box & Keypoint Tracker
        ▼
[Telemetry Stream & Alert Microservice (Docker)]`,
      keyFeatures: [
        "Trained custom vision backbones on diverse environmental & lighting conditions.",
        "Automated augmentation pipeline with CutMix, Mosaic, and affine transforms.",
        "Full INT8 model quantization using NVIDIA TensorRT for 3.4x speedup.",
        "Containerized with Docker for instantaneous deployment to AWS ECS and edge devices."
      ],
      metrics: "95.0% mAP@50 benchmark precision &bull; 48 FPS real-time processing"
    },
    analytics: {
      title: "Predictive Analytics Dashboard",
      category: "Data Science, Time-Series & Cloud Deployment",
      image: "assets/images/project-analytics.jpg",
      description: "Comprehensive forecasting tool designed for enterprise decision-makers, unifying time-series models, automated feature engineering, and real-time anomaly alerts.",
      architecture: `[ERP & CRM Data Streams]
        │
        ▼
[Data Ingestion & Cleaning (Pandas / SQL)]
        │
        ▼
[Automated Feature Pipeline (Lag, Seasonality, Fourier)]
        │
        ▼
[Ensemble Model: Gradient Boosting + ARIMA + LSTM]
        │
        ├─► Monte Carlo 95% Confidence Band Estimation
        ├─► Isolation Forest Anomaly Detection
        ▼
[Interactive Dashboard UI & Cloud API (AWS)]`,
      keyFeatures: [
        "Ensemble architecture yielding a 12.4% RMSE reduction compared to baseline models.",
        "Automated data drift detection triggering scheduled model retraining pipelines.",
        "Full scenario modeling allowing executives to test macro-economic hypothetical shifts.",
        "Exportable reports and webhooks for enterprise workflow integration."
      ],
      metrics: "96.8% forecast accuracy &bull; 42ms query evaluation time"
    }
  };

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <span class="modal-cat">${data.category}</span>
      <h3 id="modalTitle">${data.title}</h3>
      <img src="${data.image}" alt="${data.title}" class="modal-hero-img">
      <p style="color: var(--text-highlight); margin-bottom: 1rem;">${data.description}</p>
      
      <h4>Pipeline Architecture</h4>
      <pre class="modal-arch-box"><code>${data.architecture}</code></pre>

      <h4>Key Highlights &amp; Engineering Decisions</h4>
      <ul>
        ${data.keyFeatures.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <h4>Key Benchmarks</h4>
      <p style="font-family: var(--font-mono); color: var(--accent-neon-green); font-size: 0.9rem; margin-top: 0.4rem;">
        ${data.metrics}
      </p>
    `;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.project);
    });
  });

  // Demo launch button also scrolls directly to the live playground section!
  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoId = btn.dataset.demo;
      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });

        // Activate corresponding demo tab
        const tabMap = {
          chatbot: 'chat-demo',
          vision: 'cv-demo',
          analytics: 'forecast-demo'
        };

        const targetTabId = tabMap[demoId] || 'chat-demo';
        const targetTabBtn = document.querySelector(`.demo-tab-btn[data-tab="${targetTabId}"]`);
        if (targetTabBtn) targetTabBtn.click();
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
  });
}

/* ===================================================================
   8. CONTACT FORM & ONE-CLICK CLIPBOARD
=================================================================== */
function initContactFormAndClipboard() {
  // Email copying buttons
  const copyQuickBtn = document.getElementById('copyEmailQuickBtn');
  const copyCardBtn = document.getElementById('copyEmailCardBtn');
  const emailToCopy = 'manu.sharma@example.com';

  function copyEmail() {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      showToast('Copied manu.sharma@example.com to clipboard! 📋');
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = emailToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Copied to clipboard! 📋');
    });
  }

  if (copyQuickBtn) copyQuickBtn.addEventListener('click', copyEmail);
  if (copyCardBtn) copyCardBtn.addEventListener('click', copyEmail);

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // UI Loading state
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = '<span>Transmitting...</span>';

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccessMessage.style.display = 'block';
        showToast('Message sent! Manu will get back to you shortly.');
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = `<span>Send Message</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      }, 800);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      formSuccessMessage.style.display = 'none';
      contactForm.style.display = 'flex';
    });
  }
}

/* ===================================================================
   9. TOAST NOTIFICATION ENGINE
=================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

/* ===================================================================
   10. NAVIGATION & SCROLL UX
=================================================================== */
function initNavigationAndScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('currentYear');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Scroll listener for sticky navbar & back-to-top button
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Nav Active Spy
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Scroll to top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }
}
