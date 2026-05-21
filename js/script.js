/* ============================================
   TASKMATE UI PROTOTYPE
   IMS566 Individual Project
   ============================================ */

let pieChart = null;
let barChart = null;

// ==================== VANTA.JS ====================
function initVanta() {
  if (typeof VANTA !== 'undefined' && document.getElementById('vanta-bg')) {
    VANTA.WAVES({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      color: 0x0d0e1a,
      shininess: 40,
      waveHeight: 18,
      waveSpeed: 0.6,
      zoom: 0.9
    });
  }
}

// ==================== STATIC CHARTS ====================
function initCharts() {
  const pieCtx = document.getElementById('pieChart')?.getContext('2d');
  if (pieCtx) {
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{ data: [4, 1, 3], backgroundColor: ['#fbbf24', '#6366f1', '#34d399'] }]
      },
      options: { cutout: '62%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }, responsive: true }
    });
  }
  const barCtx = document.getElementById('barChart')?.getContext('2d');
  if (barCtx) {
    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: { labels: ['High', 'Medium', 'Low'], datasets: [{ label: 'Tasks', data: [3, 3, 2], backgroundColor: '#6366f1', borderRadius: 6 }] },
      options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
    });
  }
}

// ==================== PAGE LOADING ====================
async function loadPage(pageName) {
  try {
    const response = await fetch(`./pages/${pageName}.html`);
    const html = await response.text();
    document.getElementById('pageContainer').innerHTML = html;
    
    // IMPORTANT: Make sure the loaded page is visible
    const loadedPage = document.querySelector('#pageContainer .page-section');
    if (loadedPage) {
      // Remove active from all pages
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active-page');
        section.style.display = 'none';
      });
      // Show the loaded page
      loadedPage.classList.add('active-page');
      loadedPage.style.display = 'block';
    }
    
    if (pageName === 'dashboard') {
      setTimeout(() => {
        initCharts();
        const welcomeSpan = document.getElementById('welcomeName');
        if (welcomeSpan) welcomeSpan.textContent = 'User';
      }, 100);
    }
  } catch (error) {
    console.error('Error loading page:', error);
    document.getElementById('pageContainer').innerHTML = '<div class="p-6 text-center text-red-400">Error loading page. Please refresh and try again.</div>';
  }
}

// ==================== NAVIGATION ====================
function navigate(page) {
  // Hide all pages first
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active-page');
    section.style.display = 'none';
  });
  
  // Load the selected page
  loadPage(page);
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    link.classList.add('text-slate-400');
  });
  
  const activeLink = document.getElementById(`nav-${page}`);
  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.classList.remove('text-slate-400');
  }
  
  // Update page title
  const titles = { dashboard: 'Dashboard', mytasks: 'My Tasks', completed: 'Completed Tasks', calendar: 'Calendar' };
  document.getElementById('pageTitle').textContent = titles[page] || 'TaskMate';
  
  closeSidebar();
}

// ==================== SIDEBAR ====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ==================== AUTHENTICATION ====================
function doLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();
  const errorDiv = document.getElementById('loginError');
  
  errorDiv.classList.add('hidden');
  
  if (!username || !password) {
    errorDiv.classList.remove('hidden');
  } else {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appShell').style.display = 'flex';
    
    const displayName = username === 'admin' ? 'Admin User' : 'Demo User';
    const initials = username === 'admin' ? 'AD' : 'DU';
    
    document.getElementById('sidebarUsername').textContent = displayName;
    document.getElementById('avatarInitials').textContent = initials;
    
    const today = new Date();
    const todayDateElem = document.getElementById('todayDate');
    if (todayDateElem) {
      todayDateElem.textContent = today.toLocaleDateString('en-MY', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
    }
    
    navigate('dashboard');
  }
}

function doLogout() {
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
  document.getElementById('registerForm').classList.toggle('hidden', isLogin);
  
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  
  if (isLogin) {
    tabLogin.style.background = '#6366f1';
    tabLogin.classList.remove('text-slate-400');
    tabLogin.classList.add('text-white');
    tabRegister.style.background = '';
    tabRegister.classList.remove('text-white');
    tabRegister.classList.add('text-slate-400');
  } else {
    tabRegister.style.background = '#6366f1';
    tabRegister.classList.remove('text-slate-400');
    tabRegister.classList.add('text-white');
    tabLogin.style.background = '';
    tabLogin.classList.remove('text-white');
    tabLogin.classList.add('text-slate-400');
  }
}

function doRegister() {
  alert('✓ Registration UI Demo!\n\nFor demo, login with:\nadmin / task123');
  switchAuthTab('login');
}

// ==================== TASK BUTTONS ====================
function openAddModal() { alert('📝 Add Task - UI Prototype'); }
function openEditModal() { alert('✏️ Edit Task - UI Prototype'); }
function saveTask() { alert('💾 Task saved (Demo)'); closeAddModal(); }
function deleteTask() { if (confirm('Delete this task?')) alert('🗑️ Task deleted (Demo)'); }
function openViewModal(id) { alert('👁️ Task Details - UI Prototype\n\nThis would show full task information.'); }
function closeModal() { document.getElementById('modalOverlay')?.classList.remove('open'); }
function closeAddModal() { document.getElementById('addModalOverlay')?.classList.add('hidden'); }
function changeCalMonth(dir) { alert('📅 Calendar would show ' + (dir > 0 ? 'July' : 'May') + ' 2025'); }

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', function() {
  initVanta();
  
  const now = new Date();
  document.getElementById('footerYear').textContent = now.getFullYear();
  document.getElementById('footerDate').textContent = now.toLocaleDateString('en-MY', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
});
