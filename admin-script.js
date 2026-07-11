const API_URL = 'http://localhost:5000/api';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Check if logged in
window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (isLoggedIn) {
    showDashboard();
    loadAllData();
  } else {
    showLogin();
  }

  // Setup event listeners
  setupLoginForm();
  setupNavigation();
  setupLogout();
});

// Login functionality
function setupLoginForm() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMsg = document.querySelector('.error-message');

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      showDashboard();
      loadAllData();
    } else {
      errorMsg.textContent = 'Incorrect password';
      errorMsg.classList.add('show');
      setTimeout(() => {
        errorMsg.classList.remove('show');
      }, 3000);
    }
  });
}

function showLogin() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('dashboard-container').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('dashboard-container').style.display = 'grid';
}

// Navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const viewId = link.dataset.view;
      
      navLinks.forEach(l => l.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      
      link.classList.add('active');
      document.getElementById(viewId).classList.add('active');

      if (viewId === 'clients') {
        loadClients();
      } else if (viewId === 'tasks') {
        loadTasks();
      } else if (viewId === 'messages') {
        loadMessages();
      } else if (viewId === 'analytics') {
        loadAnalytics();
      }
    });
  });
}

function setupLogout() {
  const logoutBtn = document.querySelector('.logout-btn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
    document.getElementById('password').value = '';
  });
}

// Load all data on dashboard load
async function loadAllData() {
  loadClients();
  loadTasks();
  loadAnalytics();
}

// Load Clients
async function loadClients() {
  try {
    const response = await fetch(`${API_URL}/clients`);
    const clients = await response.json();
    const tbody = document.getElementById('clients-table-body');

    if (clients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-message">No clients yet</td></tr>';
      return;
    }

    tbody.innerHTML = clients.map(client => `
      <tr>
        <td><strong>${client.name}</strong></td>
        <td>${client.business_name || '-'}</td>
        <td>${client.email}</td>
        <td>${client.phone || '-'}</td>
        <td><span class="status-badge ${client.status}">${client.status}</span></td>
        <td>${new Date(client.created_at).toLocaleDateString()}</td>
        <td><button class="action-btn" onclick="viewClient(${client.id})">View</button></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading clients:', err);
  }
}

// Load Tasks
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    const tbody = document.getElementById('tasks-table-body');
    const filter = document.getElementById('task-filter').value;

    const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-message">No tasks found</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(task => `
      <tr>
        <td><strong>${task.title}</strong></td>
        <td>${task.client_id}</td>
        <td><span class="status-badge ${task.status}">${task.status}</span></td>
        <td>${task.due_date || '-'}</td>
        <td>${new Date(task.created_at).toLocaleDateString()}</td>
        <td><button class="action-btn" onclick="updateTaskStatus(${task.id}, '${task.status}')">Update</button></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading tasks:', err);
  }
}

// Load Messages
async function loadMessages() {
  try {
    // For now, show a placeholder
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '<p class="empty-message">Select a client to view messages</p>';
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

// Load Analytics
async function loadAnalytics() {
  try {
    const clientsRes = await fetch(`${API_URL}/clients`);
    const clients = await clientsRes.json();
    const tasksRes = await fetch(`${API_URL}/tasks`);
    const tasks = await tasksRes.json();

    const totalClients = clients.length;
    const activeTasks = tasks.filter(t => t.status === 'in-progress' || t.status === 'pending').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const onboarding = clients.filter(c => c.status === 'onboarding').length;

    document.getElementById('stat-total-clients').textContent = totalClients;
    document.getElementById('stat-active-tasks').textContent = activeTasks;
    document.getElementById('stat-completed-tasks').textContent = completedTasks;
    document.getElementById('stat-onboarding').textContent = onboarding;
  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

// Utility functions
function viewClient(clientId) {
  alert(`View client ${clientId} - Feature coming soon`);
}

function updateTaskStatus(taskId, currentStatus) {
  const statuses = ['pending', 'in-progress', 'completed'];
  const currentIndex = statuses.indexOf(currentStatus);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];

  fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus })
  })
  .then(() => {
    loadTasks();
  })
  .catch(err => console.error('Error updating task:', err));
}

// Search functionality
document.getElementById('client-search')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#clients-table-body tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
});

// Filter functionality
document.getElementById('task-filter')?.addEventListener('change', () => {
  loadTasks();
});
