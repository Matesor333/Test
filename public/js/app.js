document.addEventListener('DOMContentLoaded', function() {
  // Navigation handling
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const pageName = this.getAttribute('data-page');

      // Remove active class from all nav items and pages
      navItems.forEach(nav => nav.classList.remove('active'));
      pages.forEach(page => page.classList.remove('active'));

      // Add active class to clicked nav item and corresponding page
      this.classList.add('active');
      document.getElementById(`${pageName}-page`).classList.add('active');

      // Hide client details page when switching to other pages
      if (pageName !== 'client-details') {
        document.getElementById('client-details-page').classList.remove('active');
      }
    });
  });

  // Fetch and display clients
  let clients = [];

  function fetchClients() {
    fetch('/api/clients')
      .then(response => response.json())
      .then(data => {
        clients = data;
        updateDashboardStats();
        renderClientsTable();
      })
      .catch(error => console.error('Error fetching clients:', error));
  }

  function updateDashboardStats() {
    document.getElementById('total-clients').textContent = clients.length;
    document.getElementById('active-clients').textContent = Math.floor(clients.length * 0.8); // Assuming 80% are active
  }

  function renderClientsTable() {
    const tableBody = document.getElementById('clients-table-body');
    tableBody.innerHTML = '';

    clients.forEach(client => {
      const row = document.createElement('tr');

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
        viewClientDetails(clientId);
      });
    });

    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
      btn.addEventListener('click', function() {
        const clientId = parseInt(this.getAttribute('data-id'));
        deleteClient(clientId);
      });
    });
  }

  // Client details
  function viewClientDetails(clientId) {
    // Redirect to client details page
    window.location.href = `/client/${clientId}`;
  }

  function renderWorkoutPlans(client) {
    const workoutPlansContainer = document.getElementById('workout-plans-list');
    workoutPlansContainer.innerHTML = '';

    // Mock workout plans
    const workoutPlans = [
      {
        id: 1,
        name: 'Initial Strength Program',
        description: 'Focus on building foundational strength with compound movements.',
        duration: '8 weeks',
        date: '2023-09-01'
      },
      {
        id: 2,
        name: 'Hypertrophy Phase',
        description: 'Increase muscle mass with higher volume training.',
        duration: '6 weeks',
        date: '2023-11-01'
      }
    ];

    workoutPlans.forEach(plan => {
      const planCard = document.createElement('div');
      planCard.className = 'plan-card';
      planCard.innerHTML = `
        <h4>${plan.name}</h4>
        <p>${plan.description}</p>
        <div class="plan-meta">
          <span><i class="far fa-calendar"></i> ${plan.date}</span>
          <span><i class="far fa-clock"></i> ${plan.duration}</span>
        </div>
        <div class="plan-actions">
          <button class="btn-sm btn-edit">Edit</button>
          <button class="btn-sm btn-delete">Delete</button>
        </div>
      `;
      workoutPlansContainer.appendChild(planCard);
    });
  }

  function renderMealPlans(client) {
    const mealPlansContainer = document.getElementById('meal-plans-list');
    mealPlansContainer.innerHTML = '';

    // Mock meal plans
    const mealPlans = [
      {
        id: 1,
        name: 'Calorie Deficit Diet',
        description: 'Balanced diet with 500 calorie deficit to promote weight loss.',
        duration: '4 weeks',
        date: '2023-09-01'
      },
      {
        id: 2,
        name: 'Maintenance Diet',
        description: 'Balanced macros for maintaining current weight.',
        duration: '8 weeks',
        date: '2023-10-01'
      }
    ];

    mealPlans.forEach(plan => {
      const planCard = document.createElement('div');
      planCard.className = 'plan-card';
      planCard.innerHTML = `
        <h4>${plan.name}</h4>
        <p>${plan.description}</p>
        <div class="plan-meta">
          <span><i class="far fa-calendar"></i> ${plan.date}</span>
          <span><i class="far fa-clock"></i> ${plan.duration}</span>
        </div>
        <div class="plan-actions">
          <button class="btn-sm btn-edit">Edit</button>
          <button class="btn-sm btn-delete">Delete</button>
        </div>
      `;
      mealPlansContainer.appendChild(planCard);
    });
  }

  function generateWeightProgressChart(client) {
    const ctx = document.getElementById('weightProgressChart').getContext('2d');

    // Mock weight data
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 8'];
    const weightData = [];

    // Generate mock weight progress based on client's goal
    let currentWeight = client.weight;
    if (client.goal === 'Weight loss') {
      for (let i = 0; i < labels.length; i++) {
        weightData.push(currentWeight);
        currentWeight = Math.max(currentWeight - (Math.random() * 0.8 + 0.2), currentWeight * 0.85);
      }
    } else if (client.goal === 'Muscle gain') {
      for (let i = 0; i < labels.length; i++) {
        weightData.push(currentWeight);
        currentWeight = Math.min(currentWeight + (Math.random() * 0.5 + 0.1), currentWeight * 1.15);
      }
    } else {
      // General fitness - slight fluctuations
      for (let i = 0; i < labels.length; i++) {
        weightData.push(currentWeight);
        currentWeight = currentWeight + (Math.random() * 0.6 - 0.3);
      }
    }

    // Destroy existing chart if it exists
    if (window.weightChart instanceof Chart) {
      window.weightChart.destroy();
    }

    window.weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weight (kg)',
          data: weightData,
          borderColor: '#1a73e8',
          backgroundColor: 'rgba(100, 181, 246, 0.2)',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Weight Progress'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: Math.min(...weightData) - 2,
            max: Math.max(...weightData) + 2
          }
        }
      }
    });
  }

  // Delete client
  function deleteClient(clientId) {
    if (confirm('Are you sure you want to delete this client?')) {
      fetch(`/api/clients/${clientId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            clients = clients.filter(client => client.id !== clientId);
            updateDashboardStats();
            renderClientsTable();
          }
        })
        .catch(error => console.error('Error deleting client:', error));
    }
  }

  // Back button in client details
  document.getElementById('back-to-clients').addEventListener('click', function() {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('clients-page').classList.add('active');

    // Update navigation active state
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-page="clients"]').classList.add('active');
  });

  // Add new client modal
  const addClientModal = document.getElementById('add-client-modal');
  const addClientBtn = document.getElementById('add-client-btn');
  const cancelAddClient = document.getElementById('cancel-add-client');
  const closeModals = document.querySelectorAll('.close-modal');
  const addClientForm = document.getElementById('add-client-form');

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

  // Handle add client form submission
  addClientForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newClient = {
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      age: parseInt(document.getElementById('client-age').value),
      weight: parseFloat(document.getElementById('client-weight').value),
      height: parseInt(document.getElementById('client-height').value),
      goal: document.getElementById('client-goal').value
    };

    fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClient)
    })
      .then(response => response.json())
      .then(data => {
        clients.push(data);
        renderClientsTable();
        updateDashboardStats();
        addClientModal.style.display = 'none';
        addClientForm.reset();
      })
      .catch(error => console.error('Error adding client:', error));
  });

  // Plan tabs
  const planTabs = document.querySelectorAll('.plan-tab');
  const planContents = document.querySelectorAll('.plan-content');

  planTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const planType = this.getAttribute('data-plan');

      planTabs.forEach(t => t.classList.remove('active'));
      planContents.forEach(c => c.classList.remove('active'));

      this.classList.add('active');
      document.getElementById(`${planType}-plans`).classList.add('active');
    });
  });

  // Add plan modals
  const addPlanModal = document.getElementById('add-plan-modal');
  const addWorkoutPlanBtn = document.getElementById('add-workout-plan');
  const addMealPlanBtn = document.getElementById('add-meal-plan');
  const cancelAddPlan = document.getElementById('cancel-add-plan');

  addWorkoutPlanBtn.addEventListener('click', function() {
    document.getElementById('plan-modal-title').textContent = 'Add Workout Plan';
    document.getElementById('workout-plan-fields').style.display = 'block';
    document.getElementById('meal-plan-fields').style.display = 'none';
    addPlanModal.style.display = 'flex';

    // Clear any previous workout days
    document.getElementById('workout-days-container').innerHTML = '';

    // Reset day checkboxes
    document.querySelectorAll('.workout-day').forEach(checkbox => {
      checkbox.checked = false;
    });
  });

  addMealPlanBtn.addEventListener('click', function() {
    document.getElementById('plan-modal-title').textContent = 'Add Meal Plan';
    document.getElementById('workout-plan-fields').style.display = 'none';
    document.getElementById('meal-plan-fields').style.display = 'block';
    addPlanModal.style.display = 'flex';
  });

  // Handle workout day selection
  document.querySelectorAll('.workout-day').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const daysContainer = document.getElementById('workout-days-container');
      const dayValue = this.value;
      const dayId = `workout-day-${dayValue.toLowerCase()}`;

      if (this.checked) {
        // Add a new day section
        const template = document.querySelector('.workout-template');
        const newDay = template.cloneNode(true);
        newDay.classList.remove('workout-template');
        newDay.style.display = 'block';
        newDay.id = dayId;

        // Set the day name
        newDay.querySelector('.day-name').textContent = dayValue;

        // Add the "Add Exercise" button functionality
        const addExerciseBtn = newDay.querySelector('.btn-add-exercise');
        addExerciseBtn.addEventListener('click', function() {
          addExerciseRow(dayId);
        });

        daysContainer.appendChild(newDay);
      } else {
        // Remove the day section
        const dayElement = document.getElementById(dayId);
        if (dayElement) {
          dayElement.remove();
        }
      }
    });
  });

  // Function to add a new exercise row
  function addExerciseRow(dayId) {
    const dayElement = document.getElementById(dayId);
    const exercisesContainer = dayElement.querySelector('.exercises-container');

    // Use the template to create a new exercise row
    const template = document.getElementById('exercise-row-template');
    const clone = document.importNode(template.content, true);

    // Add remove exercise functionality
    const removeBtn = clone.querySelector('.btn-remove-exercise');
    removeBtn.addEventListener('click', function() {
      this.closest('.exercise-row').remove();
    });

    exercisesContainer.appendChild(clone);
  }

  // Handle workout plan form submission
  document.getElementById('add-plan-form').addEventListener('submit', function(e) {
    // Default form submission handling is already in place
    // In a real application, you would collect all the workout data here

    // Example of collecting workout plan data:
    if (document.getElementById('workout-plan-fields').style.display === 'block') {
      const workoutPlan = {
        name: document.getElementById('plan-name').value,
        description: document.getElementById('plan-description').value,
        duration: document.getElementById('plan-duration').value + ' weeks',
        date: new Date().toISOString().split('T')[0],
        days: []
      };

      // Collect data for each workout day
      document.querySelectorAll('.workout-day').forEach(checkbox => {
        if (checkbox.checked) {
          const dayValue = checkbox.value;
          const dayId = `workout-day-${dayValue.toLowerCase()}`;
          const dayElement = document.getElementById(dayId);

          const day = {
            name: dayValue,
            title: dayElement.querySelector('.workout-day-title').value,
            exercises: []
          };

          // Collect exercises for this day
          dayElement.querySelectorAll('.exercise-row').forEach(exerciseRow => {
            day.exercises.push({
              name: exerciseRow.querySelector('.exercise-name').value,
              sets: exerciseRow.querySelector('.exercise-sets').value,
              reps: exerciseRow.querySelector('.exercise-reps').value,
              notes: exerciseRow.querySelector('.exercise-notes').value
            });
          });

          workoutPlan.days.push(day);
        }
      });

      // For demo purposes, just log the data
      console.log('Workout Plan:', workoutPlan);

      // In a real app, you would save this to your backend
      // And then update the UI with the new plan
      const planCard = createWorkoutPlanCard(workoutPlan);
      document.getElementById('workout-plans-list').appendChild(planCard);
    }
  });

  // Function to create a workout plan card from plan data
  function createWorkoutPlanCard(plan) {
    const planCard = document.createElement('div');
    planCard.className = 'plan-card';

    // Format the exercises summary for display
    let exercisesSummary = '';
    if (plan.days && plan.days.length > 0) {
      exercisesSummary = `<p><strong>${plan.days.length} workout days:</strong> `;
      exercisesSummary += plan.days.map(day => day.title || day.name).join(', ');
      exercisesSummary += '</p>';
    }

    planCard.innerHTML = `
      <h4>${plan.name}</h4>
      <p>${plan.description}</p>
      ${exercisesSummary}
      <div class="plan-meta">
        <span><i class="far fa-calendar"></i> ${plan.date}</span>
        <span><i class="far fa-clock"></i> ${plan.duration}</span>
      </div>
      <div class="plan-actions">
        <button class="btn-sm btn-edit">Edit</button>
        <button class="btn-sm btn-delete">Delete</button>
      </div>
    `;

    return planCard;
  }

  cancelAddPlan.addEventListener('click', function() {
    addPlanModal.style.display = 'none';
  });

  // Initialize the application
  fetchClients();
});