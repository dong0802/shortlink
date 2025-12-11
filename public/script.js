// State
let currentUser = null;
let currentPage = 'home';

// DOM Elements
const navActions = document.getElementById('navActions');
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeModal = document.getElementById('closeModal');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const shortenForm = document.getElementById('shortenForm');
const urlInput = document.getElementById('urlInput');
const resultSection = document.getElementById('resultSection');
const shortUrl = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');
const homePage = document.getElementById('homePage');
const historyPage = document.getElementById('historyPage');
const historyContent = document.getElementById('historyContent');

// Initialize
init();

async function init() {
    await checkAuth();
    updateNav();
    setupEventListeners();
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        const data = await response.json();
        currentUser = data.user;
    } catch (error) {
        console.error('Auth check failed:', error);
        currentUser = null;
    }
}

// Update navigation
function updateNav() {
    if (currentUser) {
        navActions.innerHTML = `
      <a href="#" class="nav-link" data-page="home">Home</a>
      <a href="#" class="nav-link" data-page="history">History</a>
      <span class="nav-link">${currentUser.email}</span>
      <button class="btn btn-secondary" id="logoutBtn">Logout</button>
    `;

        document.getElementById('logoutBtn').addEventListener('click', handleLogout);

        // Add page navigation listeners
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                navigateTo(page);
            });
        });
    } else {
        navActions.innerHTML = `
      <a href="#" class="nav-link" data-page="home">Home</a>
      <button class="btn btn-primary" id="loginBtn">Sign In</button>
    `;

        document.getElementById('loginBtn').addEventListener('click', () => {
            openModal('login');
        });

        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('home');
            });
        });
    }

    // Update active nav link
    updateActiveNavLink();
}

// Update active nav link
function updateActiveNavLink() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

// Navigate to page
function navigateTo(page) {
    currentPage = page;

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show selected page
    if (page === 'home') {
        homePage.classList.add('active');
    } else if (page === 'history') {
        if (!currentUser) {
            showToast('Please sign in to view history', 'error');
            openModal('login');
            return;
        }
        historyPage.classList.add('active');
        loadHistory();
    }

    updateActiveNavLink();
}

// Setup event listeners
function setupEventListeners() {
    // Modal
    closeModal.addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    authModal.querySelector('.modal-overlay').addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    // Auth form switching
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Forms
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);
    shortenForm.addEventListener('submit', handleShorten);

    // Copy button
    copyBtn.addEventListener('click', handleCopy);
}

// Open modal
function openModal(type) {
    authModal.classList.add('active');
    if (type === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.classList.add('loading');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        showToast('Login successful!', 'success');
        authModal.classList.remove('active');
        loginFormElement.reset();

        await checkAuth();
        updateNav();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (password !== passwordConfirm) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.classList.add('loading');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        showToast('Registration successful! Please check your email to verify your account.', 'success');
        registerFormElement.reset();

        // Switch to login form
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

// Handle logout
async function handleLogout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        currentUser = null;
        updateNav();
        navigateTo('home');
        showToast('Logged out successfully', 'success');
    } catch (error) {
        showToast('Logout failed', 'error');
    }
}

// Handle shorten
async function handleShorten(e) {
    e.preventDefault();

    const url = urlInput.value.trim();

    if (!url) {
        showToast('Please enter a URL', 'error');
        return;
    }

    const btn = document.getElementById('shortenBtn');
    btn.classList.add('loading');

    try {
        const response = await fetch('/api/links/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }

        // Show result
        shortUrl.href = data.shortUrl;
        shortUrl.textContent = data.shortUrl;
        resultSection.classList.remove('hidden');

        showToast('URL shortened successfully!', 'success');

        // Clear input
        urlInput.value = '';
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

// Handle copy
async function handleCopy() {
    const url = shortUrl.textContent;

    try {
        await navigator.clipboard.writeText(url);
        showToast('Copied to clipboard!', 'success');

        // Visual feedback
        copyBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

        setTimeout(() => {
            copyBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4.16667 12.5H3.33333C2.89131 12.5 2.46738 12.3244 2.15482 12.0118C1.84226 11.6993 1.66667 11.2754 1.66667 10.8333V3.33333C1.66667 2.89131 1.84226 2.46738 2.15482 2.15482C2.46738 1.84226 2.89131 1.66667 3.33333 1.66667H10.8333C11.2754 1.66667 11.6993 1.84226 12.0118 2.15482C12.3244 2.46738 12.5 2.89131 12.5 3.33333V4.16667M9.16667 7.5H16.6667C17.5871 7.5 18.3333 8.24619 18.3333 9.16667V16.6667C18.3333 17.5871 17.5871 18.3333 16.6667 18.3333H9.16667C8.24619 18.3333 7.5 17.5871 7.5 16.6667V9.16667C7.5 8.24619 8.24619 7.5 9.16667 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
        }, 2000);
    } catch (error) {
        showToast('Failed to copy', 'error');
    }
}

// Load history
async function loadHistory() {
    historyContent.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading...</div>';

    try {
        const response = await fetch('/api/links/history', {
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load history');
        }

        if (data.links.length === 0) {
            historyContent.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>No links yet</h3>
          <p>Start by shortening your first URL!</p>
        </div>
      `;
            return;
        }

        const html = `
      <div class="history-grid">
        ${data.links.map(link => `
          <div class="history-card" data-short-code="${link.shortCode}">
            <div class="history-header">
              <div class="history-urls">
                <a href="${window.location.origin}/${link.shortCode}" target="_blank" class="history-short">
                  ${window.location.origin}/${link.shortCode}
                </a>
                <div class="history-original">${link.originalUrl}</div>
              </div>
              <button class="view-details-btn" onclick="toggleDetails('${link.shortCode}')">
                View Stats
              </button>
            </div>
            <div class="history-stats">
              <div class="stat-item">
                <span>👆 Clicks:</span>
                <span class="stat-value">${link.clickCount}</span>
              </div>
              <div class="stat-item">
                <span>📅 Created:</span>
                <span class="stat-value">${new Date(link.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div class="click-details" id="details-${link.shortCode}">
              <!-- Will be loaded when clicked -->
            </div>
          </div>
        `).join('')}
      </div>
    `;

        historyContent.innerHTML = html;
    } catch (error) {
        historyContent.innerHTML = `
      <div class="empty-state">
        <h3>Error loading history</h3>
        <p>${error.message}</p>
      </div>
    `;
    }
}

// Toggle details
async function toggleDetails(shortCode) {
    const detailsEl = document.getElementById(`details-${shortCode}`);

    if (detailsEl.classList.contains('active')) {
        detailsEl.classList.remove('active');
        return;
    }

    // Load stats
    detailsEl.innerHTML = '<div style="text-align: center; padding: 1rem;">Loading...</div>';
    detailsEl.classList.add('active');

    try {
        const response = await fetch(`/api/links/stats/${shortCode}`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load stats');
        }

        if (data.clicks.length === 0) {
            detailsEl.innerHTML = '<div style="text-align: center; padding: 1rem; color: var(--gray-light);">No clicks yet</div>';
            return;
        }

        const html = `
      <h4 style="margin-bottom: 1rem; color: var(--white);">Click History (${data.clicks.length} total)</h4>
      <div class="click-list">
        ${data.clicks.slice().reverse().map((click, index) => `
          <div class="click-item">
            <div class="click-item-row">
              <span class="click-label">Click #${data.clicks.length - index}</span>
              <span class="click-value">${new Date(click.timestamp).toLocaleString('vi-VN')}</span>
            </div>
            <div class="click-item-row">
              <span class="click-label">IP:</span>
              <span class="click-value">${click.ip}</span>
            </div>
            <div class="click-item-row">
              <span class="click-label">User Agent:</span>
              <span class="click-value" style="font-size: 0.75rem;">${click.userAgent}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

        detailsEl.innerHTML = html;
    } catch (error) {
        detailsEl.innerHTML = `<div style="text-align: center; padding: 1rem; color: var(--danger);">Error: ${error.message}</div>`;
    }
}

// Show toast
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make toggleDetails global
window.toggleDetails = toggleDetails;
