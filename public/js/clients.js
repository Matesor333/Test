
// Load clients from the server
let clients = [];

document.addEventListener('DOMContentLoaded', function() {
  // Fetch clients from API
  fetchClients();
  
  // Add event listeners
  const addClientBtn = document.getElementById('add-client-btn');
  const cancelAddClient = document.getElementById('cancel-add-client');
  const closeModals = document.querySelectorAll('.close-modal');
  const addClientForm = document.getElementById('add-client-form');
  const addClientModal = document.getElementById('add-client-modal');
  
  addClientBtn.addEventListener('click', function() {
    addClientModal.style.display = 'flex';
  });
  
  cancelAddClient.addEventListener('click', function() {
    addClientModal.style.display = 'none';
  });
  
  closeModals.forEach(close => {
    close.addEventListener('click', function() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Handle form submission
  addClientForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newClient = {
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      age: parseInt(document.getElementById('client-age').value),
      weight: parseInt(document.getElementById('client-weight').value),
      height: parseInt(document.getElementById('client-height').value),
      goal: document.getElementById('client-goal').value
    };
    
    // Send to server
    createClient(newClient);
  });
  
  // Search functionality
  document.getElementById('client-search').addEventListener('input', function(e) {
    filterClients();
  });
  
  // Filter functionality
  document.getElementById('filter-status').addEventListener('change', filterClients);
  document.getElementById('filter-goal').addEventListener('change', filterClients);
});

function fetchClients() {
  fetch('/api/clients')
    .then(response => response.json())
    .then(data => {
      clients = data;
      renderClientsTable();
    })
    .catch(error => {
      console.error('Error fetching clients:', error);
    });
}

function createClient(clientData) {
  fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientData)
  })
    .then(response => response.json())
    .then(data => {
      clients.push(data);
      renderClientsTable();
      document.getElementById('add-client-modal').style.display = 'none';
      document.getElementById('add-client-form').reset();
    })
    .catch(error => {
      console.error('Error creating client:', error);
    });
}

function deleteClient(clientId) {
  if (confirm('Are you sure you want to delete this client?')) {
    fetch(`/api/clients/${clientId}`, {
      method: 'DELETE'
    })
      .then(response => {
        clients = clients.filter(client => client.id !== clientId);
        renderClientsTable();
      })
      .catch(error => {
        console.error('Error deleting client:', error);
      });
  }
}

function renderClientsTable() {
  const tableBody = document.getElementById('clients-table-body');
  tableBody.innerHTML = '';

  clients.forEach(client => {
    const row = document.createElement('tr');
    
    // Generate random status for demonstration
    const statusClass = Math.random() > 0.2 ? 'status-active' : 'status-inactive';
    const statusText = statusClass === 'status-active' ? 'Active' : 'Inactive';

    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.age}</td>
      <td>${client.goal}</td>
      <td><span class="client-status ${statusClass}">${statusText}</span></td>
      <td class="actions-cell">
        <button class="btn-icon view" data-id="${client.id}"><i class="fas fa-eye"></i></button>
        <button class="btn-icon delete" data-id="${client.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Add event listeners to view and delete buttons
  document.querySelectorAll('.btn-icon.view').forEach(btn => {
    btn.addEventListener('click', function() {
      const clientId = this.getAttribute('data-id');
      window.location.href = `/client/${clientId}`;
    });
  });

  document.querySelectorAll('.btn-icon.delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const clientId = parseInt(this.getAttribute('data-id'));
      deleteClient(clientId);
    });
  });
}

function filterClients() {
  const searchTerm = document.getElementById('client-search').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status').value;
  const goalFilter = document.getElementById('filter-goal').value;
  
  const tableBody = document.getElementById('clients-table-body');
  const rows = tableBody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    const email = row.cells[1].textContent.toLowerCase();
    const goal = row.cells[3].textContent.toLowerCase();
    const status = row.cells[4].querySelector('.client-status').textContent.toLowerCase();
    
    const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || status.includes(statusFilter.toLowerCase());
    const matchesGoal = goalFilter === 'all' || 
      (goalFilter === 'weight-loss' && goal.includes('weight loss')) ||
      (goalFilter === 'muscle-gain' && goal.includes('muscle gain')) ||
      (goalFilter === 'general-fitness' && goal.includes('general fitness'));
    
    if (matchesSearch && matchesStatus && matchesGoal) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}
