// Login Credentials
const VALID_ID = '254037331';
const VALID_PASSWORD = 'wulan665';

// DOM Elements
const idDosen = document.getElementById('idDosen');
const password = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        navigateTo('dashboard');
    }
    
    // Add event listeners
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Add enter key listener for inputs
    idDosen.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            password.focus();
        }
    });
    
    password.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin('email');
        }
    });
    
    // Load saved grades if any
    loadSavedGrades();
});

// Toggle Password Visibility
function togglePasswordVisibility() {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    // Toggle icon
    togglePassword.innerHTML = type === 'password' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
           </svg>`;
}

// Handle Login
function handleLogin(method) {
    const inputId = idDosen.value.trim();
    const inputPassword = password.value;
    
    // Validate inputs
    if (!inputId) {
        showAlert('Silakan masukkan NIP/NIDN/ID Dosen', 'error');
        idDosen.focus();
        return;
    }
    
    if (!inputPassword) {
        showAlert('Silakan masukkan password', 'error');
        password.focus();
        return;
    }
    
    // Check credentials
    if (inputId !== VALID_ID) {
        showAlert('ID Dosen tidak valid! Silakan coba lagi.', 'error');
        idDosen.focus();
        return;
    }
    
    if (inputPassword !== VALID_PASSWORD) {
        showAlert('Password salah! Silakan coba lagi.', 'error');
        password.focus();
        return;
    }
    
    // Login successful
    showAlert(`Login berhasil via ${method === 'email' ? 'Email' : 'WhatsApp'}! Mengalihkan ke dashboard...`, 'success');
    
    // Save login state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginMethod', method);
    
    // Navigate to dashboard after delay (3 detik)
    setTimeout(() => {
        navigateTo('dashboard');
        removeAlert();
    }, 3000);
}

// Handle Logout
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Clear login state
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginMethod');
        
        // Clear form
        idDosen.value = '';
        password.value = '';
        
        // Navigate to login
        navigateTo('login');
    }
}

// Navigation
function navigateTo(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.remove('active');
        p.classList.remove('fade-in');
    });
    
    // Show target page with animation
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active', 'fade-in');
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// View Grades
function viewGrades() {
    navigateTo('grades');
}

// Save Grades
function saveGrades() {
    const psikologi = document.getElementById('gradePsikologi').value;
    const pesertaDidik = document.getElementById('gradePesertaDidik').value;
    const hifdzliHadist = document.getElementById('gradeHifdzliHadist').value;
    
    // Validate grades
    if (psikologi === '' || hifdzliHadist === '') {
        showAlert('Mohon lengkapi semua nilai!', 'error');
        return;
    }
    
    if (psikologi < 0 || psikologi > 100 || pesertaDidik > 100 || hifdzliHadist < 0 || hifdzliHadist > 100) {
        showAlert('Nilai harus antara 0 dan 100!', 'error');
        return;
    }
    
    // Save grades to localStorage
    const grades = {
        nim: '22121006',
        nama: 'Sandy Andesta Saputra',
        psikologiPerkembangan: psikologi,
        hifdzliHadist: hifdzliHadist,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('studentGrades', JSON.stringify(grades));
    
    showAlert('Nilai berhasil disimpan!', 'success');
    
    // Navigate back to students list after delay
    setTimeout(() => {
        removeAlert();
    }, 1500);
}

// Load Saved Grades
function loadSavedGrades() {
    const savedGrades = localStorage.getItem('studentGrades');
    if (savedGrades) {
        const grades = JSON.parse(savedGrades);
        
        // Only load if it's for the correct student
        if (grades.nim === '22121006') {
            setTimeout(() => {
                document.getElementById('gradePsikologi').value = grades.psikologiPerkembangan || 0;
                document.getElementById('gradePesertaDidik').value = grades.pesertaDidik || 0;
                document.getElementById('gradeHifdzliHadist').value = grades.hifdzliHadist || 0;
            }, 100);
        }
    }
}

// Show Alert Message
function showAlert(message, type) {
    // Remove existing alerts
    removeAlert();
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.id = 'customAlert';
    alertDiv.textContent = message;
    
    // Insert after login form or at the top of active page
    const loginForm = document.querySelector('.login-form');
    const activePage = document.querySelector('.page.active');
    
    if (loginForm && type === 'error') {
        loginForm.insertAdjacentElement('beforebegin', alertDiv);
    } else if (activePage) {
        activePage.insertBefore(alertDiv, activePage.firstChild);
    }
    
    // Auto remove success alerts after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            removeAlert();
        }, 3000);
    }
}

// Remove Alert
function removeAlert() {
    const alert = document.getElementById('customAlert');
    if (alert) {
        alert.remove();
    }
}

// Logo Loading Handler
function handleLogoLoad() {
    const logoImages = document.querySelectorAll('.logo, .nav-logo');
    logoImages.forEach(img => {
        img.onerror = function() {
            // If logo fails to load, show placeholder
            this.style.display = 'none';
        };
    });
}

// Initialize logo handler
handleLogoLoad();