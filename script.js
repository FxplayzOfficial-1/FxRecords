// ===== Application State =====
const app = {
    currentUser: null,
    users: [],
    releases: [],
    notifications: [],
    settings: {
        twilioEnabled: false,
        twilioAccountSid: '',
        twilioAuthToken: '',
        twilioPhoneNumber: ''
    }
};

// ===== Local Storage Manager =====
const StorageManager = {
    saveUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    getUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    removeUser: () => {
        localStorage.removeItem('currentUser');
    },
    
    saveUsers: (users) => {
        localStorage.setItem('fxrecords_users', JSON.stringify(users));
    },
    
    getUsers: () => {
        const users = localStorage.getItem('fxrecords_users');
        return users ? JSON.parse(users) : [];
    },
    
    saveReleases: (releases) => {
        localStorage.setItem('fxrecords_releases', JSON.stringify(releases));
    },
    
    getReleases: () => {
        const releases = localStorage.getItem('fxrecords_releases');
        return releases ? JSON.parse(releases) : getSampleReleases();
    },
    
    saveNotifications: (notifications) => {
        localStorage.setItem('fxrecords_notifications', JSON.stringify(notifications));
    },
    
    getNotifications: () => {
        const notifications = localStorage.getItem('fxrecords_notifications');
        return notifications ? JSON.parse(notifications) : [];
    }
};

// ===== Sample Data =====
function getSampleReleases() {
    return [
        {
            id: 1,
            title: 'Summer Vibes EP',
            artist: 'FxRecords',
            description: 'Feel-good tracks for your summer playlist',
            date: '2026-07-15',
            genre: 'Electronic'
        },
        {
            id: 2,
            title: 'Midnight Sessions',
            artist: 'FxRecords',
            description: 'Late night chill tracks',
            date: '2026-06-20',
            genre: 'Ambient'
        },
        {
            id: 3,
            title: 'Beat Drops Vol. 3',
            artist: 'FxRecords',
            description: 'Hard-hitting basslines and drops',
            date: '2026-06-01',
            genre: 'Drum & Bass'
        }
    ];
}

// ===== DOM Elements =====
const elements = {
    authModal: document.getElementById('authModal'),
    dashboardModal: document.getElementById('dashboardModal'),
    adminModal: document.getElementById('adminModal'),
    authToggleBtn: document.getElementById('authToggleBtn'),
    heroSignUpBtn: document.getElementById('heroSignUpBtn'),
    signInTab: document.getElementById('signInTab'),
    signUpTab: document.getElementById('signUpTab'),
    signInForm: document.getElementById('signInForm'),
    signUpForm: document.getElementById('signUpForm'),
    switchToSignUp: document.getElementById('switchToSignUp'),
    switchToSignIn: document.getElementById('switchToSignIn'),
    releasesList: document.getElementById('releasesList'),
    userNameDisplay: document.getElementById('userNameDisplay'),
    logoutBtn: document.getElementById('logoutBtn'),
    dashboardTabs: document.querySelectorAll('.dashboard-tab-btn'),
    dashboardTabContents: document.querySelectorAll('.dashboard-tab-content'),
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profilePhone: document.getElementById('profilePhone'),
    profileNotifications: document.getElementById('profileNotifications'),
    notificationReleases: document.getElementById('notificationReleases'),
    notificationNews: document.getElementById('notificationNews'),
    notificationAnnouncements: document.getElementById('notificationAnnouncements'),
    saveNotificationsBtn: document.getElementById('saveNotificationsBtn'),
    userReleasesList: document.getElementById('userReleasesList'),
    notificationForm: document.getElementById('notificationForm'),
    toast: document.getElementById('toast'),
    modalCloseButtons: document.querySelectorAll('.modal-close')
};

// ===== Toast Notifications =====
function showToast(message, type = 'success', duration = 3000) {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, duration);
}

// ===== Authentication Functions =====
function hashPassword(password) {
    // Simple hash function for demo (use bcrypt in production)
    return btoa(password);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const phone = document.getElementById('signUpPhone').value.trim();
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    const notificationsEnabled = document.getElementById('signUpNotifications').checked;
    
    // Validation
    if (!name || !email || !phone || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUser = app.users.find(u => u.email === email);
    if (existingUser) {
        showToast('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password: hashPassword(password),
        notificationsEnabled,
        createdAt: new Date().toISOString(),
        preferences: {
            releases: true,
            news: true,
            announcements: true
        }
    };
    
    app.users.push(newUser);
    StorageManager.saveUsers(app.users);
    
    // Auto sign in
    app.currentUser = newUser;
    StorageManager.saveUser(newUser);
    
    // Send welcome SMS if enabled
    if (notificationsEnabled) {
        sendSMS(phone, `Welcome to FxRecords, ${name}! You'll receive notifications about new releases and updates.`);
    }
    
    showToast('Account created successfully!', 'success');
    closeAuthModal();
    updateUI();
}

function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;
    
    // Find user
    const user = app.users.find(u => u.email === email);
    
    if (!user) {
        showToast('User not found', 'error');
        return;
    }
    
    // Verify password
    if (user.password !== hashPassword(password)) {
        showToast('Invalid password', 'error');
        return;
    }
    
    // Sign in
    app.currentUser = user;
    StorageManager.saveUser(user);
    
    showToast('Signed in successfully!', 'success');
    closeAuthModal();
    updateUI();
}

function handleLogout() {
    app.currentUser = null;
    StorageManager.removeUser();
    closeAllModals();
    updateUI();
    showToast('Logged out successfully', 'success');
}

// ===== Modal Management =====
function openAuthModal() {
    elements.authModal.classList.remove('hidden');
    elements.signInTab.classList.remove('hidden');
    elements.signUpTab.classList.add('hidden');
}

function closeAuthModal() {
    elements.authModal.classList.add('hidden');
}

function closeDashboardModal() {
    elements.dashboardModal.classList.add('hidden');
}

function closeAdminModal() {
    elements.adminModal.classList.add('hidden');
}

function closeAllModals() {
    closeAuthModal();
    closeDashboardModal();
    closeAdminModal();
}

function openDashboard() {
    if (app.currentUser) {
        elements.dashboardModal.classList.remove('hidden');
        updateDashboard();
    }
}

function openAdminPanel() {
    elements.adminModal.classList.remove('hidden');
}

// ===== Tab Switching =====
function switchTab(tabName) {
    if (tabName === 'signup') {
        elements.signInTab.classList.add('hidden');
        elements.signUpTab.classList.remove('hidden');
    } else {
        elements.signInTab.classList.remove('hidden');
        elements.signUpTab.classList.add('hidden');
    }
}

function switchDashboardTab(tabName) {
    elements.dashboardTabContents.forEach(tab => tab.classList.add('hidden'));
    elements.dashboardTabs.forEach(btn => btn.classList.remove('active'));
    
    const tab = document.getElementById(tabName + 'Tab');
    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (tab) tab.classList.remove('hidden');
    if (btn) btn.classList.add('active');
}

// ===== Dashboard Functions =====
function updateDashboard() {
    if (!app.currentUser) return;
    
    elements.userNameDisplay.textContent = app.currentUser.name;
    elements.profileName.textContent = app.currentUser.name;
    elements.profileEmail.textContent = app.currentUser.email;
    elements.profilePhone.textContent = app.currentUser.phone;
    elements.profileNotifications.textContent = app.currentUser.notificationsEnabled ? 'Enabled' : 'Disabled';
    
    // Load preferences
    elements.notificationReleases.checked = app.currentUser.preferences.releases;
    elements.notificationNews.checked = app.currentUser.preferences.news;
    elements.notificationAnnouncements.checked = app.currentUser.preferences.announcements;
}

function saveNotificationPreferences() {
    if (!app.currentUser) return;
    
    app.currentUser.preferences = {
        releases: elements.notificationReleases.checked,
        news: elements.notificationNews.checked,
        announcements: elements.notificationAnnouncements.checked
    };
    
    StorageManager.saveUser(app.currentUser);
    showToast('Notification preferences saved!', 'success');
}

function updateUI() {
    if (app.currentUser) {
        elements.authToggleBtn.textContent = 'Dashboard';
        elements.authToggleBtn.onclick = openDashboard;
    } else {
        elements.authToggleBtn.textContent = 'Sign In';
        elements.authToggleBtn.onclick = openAuthModal;
    }
}

// ===== Releases Management =====
function displayReleases() {
    app.releases = StorageManager.getReleases();
    
    elements.releasesList.innerHTML = app.releases.map(release => `
        <div class="release-card">
            <h3>${release.title}</h3>
            <p><strong>Artist:</strong> ${release.artist}</p>
            <p>${release.description}</p>
            <p><strong>Genre:</strong> ${release.genre}</p>
            <div class="release-date">Released: ${formatDate(release.date)}</div>
        </div>
    `).join('');
}

function displayUserReleases() {
    elements.userReleasesList.innerHTML = app.releases.map(release => `
        <div class="release-card">
            <h3>${release.title}</h3>
            <p>${release.description}</p>
            <div class="release-date">Released: ${formatDate(release.date)}</div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// ===== SMS Integration (Simulated) =====
function sendSMS(phoneNumber, message) {
    // Simulated SMS sending
    // In production, integrate with Twilio or similar service
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    
    // Store notification
    const notification = {
        id: Date.now(),
        phone: phoneNumber,
        message: message,
        timestamp: new Date().toISOString(),
        status: 'sent'
    };
    
    app.notifications.push(notification);
    StorageManager.saveNotifications(app.notifications);
}

function sendBroadcastSMS(title, message, type) {
    // Send SMS to all users with notifications enabled
    const recipientUsers = app.users.filter(user => 
        user.notificationsEnabled && user.preferences[getPreferenceKey(type)]
    );
    
    let sent = 0;
    recipientUsers.forEach(user => {
        const fullMessage = `📢 ${title}\n${message}`;
        sendSMS(user.phone, fullMessage);
        sent++;
    });
    
    return sent;
}

function getPreferenceKey(type) {
    const typeMap = {
        'release': 'releases',
        'news': 'news',
        'announcement': 'announcements'
    };
    return typeMap[type] || 'news';
}

function handleNotificationSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('notificationTitle').value.trim();
    const type = document.getElementById('notificationType').value;
    const message = document.getElementById('notificationMessage').value.trim();
    
    if (!title || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Send SMS broadcast
    const sent = sendBroadcastSMS(title, message, type);
    
    // Create release if it's a release notification
    if (type === 'release') {
        const newRelease = {
            id: Date.now(),
            title: title,
            artist: 'FxRecords',
            description: message,
            date: new Date().toISOString().split('T')[0],
            genre: 'New Release'
        };
        
        app.releases.unshift(newRelease);
        StorageManager.saveReleases(app.releases);
    }
    
    showToast(`SMS sent to ${sent} users!`, 'success');
    elements.notificationForm.reset();
    closeAdminModal();
    displayReleases();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Auth modal
    elements.authToggleBtn.addEventListener('click', openAuthModal);
    elements.heroSignUpBtn.addEventListener('click', () => {
        openAuthModal();
        switchTab('signup');
    });
    
    // Forms
    elements.signInForm.addEventListener('submit', handleSignIn);
    elements.signUpForm.addEventListener('submit', handleSignUp);
    
    // Tab switching
    elements.switchToSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('signup');
    });
    
    elements.switchToSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('signin');
    });
    
    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Dashboard tabs
    elements.dashboardTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            switchDashboardTab(btn.dataset.tab);
        });
    });
    
    // Save notification preferences
    elements.saveNotificationsBtn.addEventListener('click', saveNotificationPreferences);
    
    // Notification form
    elements.notificationForm.addEventListener('submit', handleNotificationSubmit);
    
    // Close modals
    elements.modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// ===== Admin Access =====
function enableAdminMode() {
    // Keyboard shortcut: Press 'A' three times quickly to enable admin panel
    let adminKeyPresses = 0;
    let lastAdminKeyTime = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'a') {
            const currentTime = Date.now();
            if (currentTime - lastAdminKeyTime > 500) {
                adminKeyPresses = 1;
            } else {
                adminKeyPresses++;
            }
            lastAdminKeyTime = currentTime;
            
            if (adminKeyPresses === 3) {
                openAdminPanel();
                adminKeyPresses = 0;
            }
        }
    });
}

// ===== Initialize Application =====
function initializeApp() {
    // Load data from storage
    app.users = StorageManager.getUsers();
    app.releases = StorageManager.getReleases();
    app.notifications = StorageManager.getNotifications();
    app.currentUser = StorageManager.getUser();
    
    // Setup event listeners
    setupEventListeners();
    
    // Enable admin mode
    enableAdminMode();
    
    // Update UI
    updateUI();
    displayReleases();
    
    console.log('✅ FxRecords initialized successfully');
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', initializeApp);
