document.addEventListener('DOMContentLoaded', function() {
  // Get client ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id') || window.location.pathname.split('/client/')[1];

  // Fetch client details
  fetchClientDetails(clientId);

  // Setup UI elements
  setupUIElements();

  // Setup event listeners
  setupEventListeners();
});

function fetchClientDetails(clientId) {
  // For demo, we'll use mock data since we don't have a real API endpoint
  const mockClient = {
    id: clientId || '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 32,
    height: 185,
    weight: 82,
    goal: 'Weight loss',
    status: 'active'
  };

  displayClientDetails(mockClient);
  setupWeightChart(mockClient);
  populateSampleWorkoutPlans();
  populateSampleMealPlans();
}

function displayClientDetails(client) {
  // Update header
  const clientNameHeader = document.getElementById('client-name-header');
  if (clientNameHeader) {
    clientNameHeader.textContent = client.name;
  }

  // Update basic info
  document.getElementById('detail-name').textContent = client.name;
  document.getElementById('detail-email').textContent = client.email;
  document.getElementById('detail-age').textContent = client.age;
  document.getElementById('detail-height').textContent = `${client.height} cm`;
  document.getElementById('detail-weight').textContent = `${client.weight} kg`;
  document.getElementById('detail-goal').textContent = client.goal;
}

function setupWeightChart(client) {
  // Get the chart canvas
  const ctx = document.getElementById('weightProgressChart').getContext('2d');

  // Generate some demo weight data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const weights = [
    client.weight + 5,
    client.weight + 3,
    client.weight + 2,
    client.weight + 1,
    client.weight,
    client.weight - 1
  ];

  // Create chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Weight (kg)',
        data: weights,
        borderColor: '#4a6cf7',
        backgroundColor: 'rgba(74, 108, 247, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          min: Math.min(...weights) - 2,
          max: Math.max(...weights) + 2
        }
      }
    }
  });
}

function populateSampleWorkoutPlans() {
  const workoutPlansList = document.getElementById('workout-plans-list');

  const samplePlans = [
    {
      name: 'Weight Loss Program',
      description: 'High intensity interval training focused on burning calories',
      duration: '8 weeks',
      days: 'Mon, Wed, Fri'
    },
    {
      name: 'Strength Building',
      description: 'Progressive overload with compound movements',
      duration: '12 weeks',
      days: 'Tue, Thu, Sat'
    }
  ];

  workoutPlansList.innerHTML = '';

  samplePlans.forEach(plan => {
    const planElement = document.createElement('div');
    planElement.className = 'plan-card';
    planElement.innerHTML = `
      <h4>${plan.name}</h4>
      <p>${plan.description}</p>
      <div class="plan-meta">
        <span><i class="far fa-calendar"></i> ${plan.duration}</span>
        <span><i class="far fa-clock"></i> ${plan.days}</span>
      </div>
      <div class="plan-actions">
        <button class="btn-sm btn-edit">Edit</button>
        <button class="btn-sm btn-delete">Delete</button>
      </div>
    `;

    workoutPlansList.appendChild(planElement);
  });
}

function populateSampleMealPlans() {
  const mealPlansList = document.getElementById('meal-plans-list');

  const samplePlans = [
    {
      name: 'Calorie Deficit Diet',
      description: '1800 calories per day with high protein focus',
      duration: '4 weeks',
      details: 'Balanced macros: 40% protein, 30% carbs, 30% fat'
    },
    {
      name: 'Muscle Building Nutrition',
      description: '2500 calories with protein emphasis',
      duration: '6 weeks',
      details: 'High protein, moderate carbs, low fat'
    }
  ];

  mealPlansList.innerHTML = '';

  samplePlans.forEach(plan => {
    const planElement = document.createElement('div');
    planElement.className = 'plan-card';
    planElement.innerHTML = `
      <h4>${plan.name}</h4>
      <p>${plan.description}</p>
      <div class="plan-meta">
        <span><i class="far fa-calendar"></i> ${plan.duration}</span>
        <span><i class="fas fa-utensils"></i> ${plan.details}</span>
      </div>
      <div class="plan-actions">
        <button class="btn-sm btn-edit">Edit</button>
        <button class="btn-sm btn-delete">Delete</button>
      </div>
    `;

    mealPlansList.appendChild(planElement);
  });
}

function setupUIElements() {
  const planTabs = document.querySelectorAll('.plan-tab');
  const planContents = document.querySelectorAll('.plan-content');

  // Initialize tabs
  planTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const planType = this.getAttribute('data-plan');

      // Update tabs
      planTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update content
      planContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${planType}-plans`).classList.add('active');
    });
  });
}

function setupEventListeners() {
  // Back button
  const backButton = document.getElementById('back-to-clients');
  if (backButton) {
    backButton.addEventListener('click', function() {
      window.location.href = '/clients';
    });
  }

  // Add plan buttons
  const addWorkoutPlanBtn = document.getElementById('add-workout-plan');
  if (addWorkoutPlanBtn) {
    addWorkoutPlanBtn.addEventListener('click', function() {
      showPlanModal('workout');
    });
  }

  const addMealPlanBtn = document.getElementById('add-meal-plan');
  if (addMealPlanBtn) {
    addMealPlanBtn.addEventListener('click', function() {
      showPlanModal('meal');
    });
  }

  // Modal close buttons
  const closeModalBtn = document.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      document.getElementById('add-plan-modal').style.display = 'none';
    });
  }

  const cancelAddPlanBtn = document.getElementById('cancel-add-plan');
  if (cancelAddPlanBtn) {
    cancelAddPlanBtn.addEventListener('click', function() {
      document.getElementById('add-plan-modal').style.display = 'none';
    });
  }

  // When clicking outside the modal content, close the modal
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('add-plan-modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Form submission
  const addPlanForm = document.getElementById('add-plan-form');
  if (addPlanForm) {
    addPlanForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const planName = document.getElementById('plan-name').value;
      const planDescription = document.getElementById('plan-description').value;
      const planDuration = document.getElementById('plan-duration').value;
      const planType = document.getElementById('workout-plan-fields').style.display === 'block' ? 'workout' : 'meal';

      // Create a plan card and add it to the list
      const planCard = document.createElement('div');
      planCard.className = 'plan-card';
      planCard.innerHTML = `
        <h4>${planName}</h4>
        <p>${planDescription}</p>
        <div class="plan-meta">
          <span><i class="far fa-calendar"></i> ${planDuration} weeks</span>
          <span><i class="fas fa-${planType === 'workout' ? 'dumbbell' : 'utensils'}"></i> 
            ${planType === 'workout' ? 'Custom program' : 'Custom diet'}</span>
        </div>
        <div class="plan-actions">
          <button class="btn-sm btn-edit">Edit</button>
          <button class="btn-sm btn-delete">Delete</button>
        </div>
      `;

      const listId = `${planType}-plans-list`;
      document.getElementById(listId).prepend(planCard);

      // Close modal and reset form
      document.getElementById('add-plan-modal').style.display = 'none';
      addPlanForm.reset();
    });
  }

  // Workout days selection in modal
  const workoutDayCheckboxes = document.querySelectorAll('.workout-day');
  if (workoutDayCheckboxes.length > 0) {
    initWorkoutDaySelections();
  }
}

function initWorkoutDaySelections() {
  const workoutDayCheckboxes = document.querySelectorAll('.workout-day');
  const workoutDaysContainer = document.getElementById('workout-days-container');

  workoutDayCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        const day = this.value;
        addWorkoutDaySection(day);
      } else {
        const day = this.value;
        const section = workoutDaysContainer.querySelector(`[data-day="${day}"]`);
        if (section) {
          section.remove();
        }
      }
    });
  });
}

function addWorkoutDaySection(day) {
  const workoutDaysContainer = document.getElementById('workout-days-container');
  const template = document.querySelector('.workout-template');

  if (!workoutDaysContainer || !template) return;

  const clone = template.cloneNode(true);
  clone.style.display = 'block';
  clone.classList.remove('workout-template');
  clone.dataset.day = day;

  clone.querySelector('.day-name').textContent = day;

  // Add event listener for adding exercises
  clone.querySelector('.btn-add-exercise').addEventListener('click', function() {
    const container = clone.querySelector('.exercises-container');
    addExerciseRow(container);
  });

  workoutDaysContainer.appendChild(clone);

  // Add first exercise row
  addExerciseRow(clone.querySelector('.exercises-container'));
}

function addExerciseRow(container) {
  if (!container) return;

  const template = document.getElementById('exercise-row-template');
  if (!template) return;

  const exerciseRow = document.importNode(template.content, true);

  // Add event listener to remove button
  exerciseRow.querySelector('.btn-remove-exercise').addEventListener('click', function() {
    this.closest('.exercise-row').remove();
  });

  container.appendChild(exerciseRow);
}

function showPlanModal(planType) {
  const modal = document.getElementById('add-plan-modal');
  const modalTitle = document.getElementById('plan-modal-title');
  const workoutFields = document.getElementById('workout-plan-fields');
  const mealFields = document.getElementById('meal-plan-fields');

  if (!modal) return;

  // Set title and visible fields based on plan type
  if (modalTitle) {
    modalTitle.textContent = `Add ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`;
  }

  if (workoutFields && mealFields) {
    workoutFields.style.display = planType === 'workout' ? 'block' : 'none';
    mealFields.style.display = planType === 'meal' ? 'block' : 'none';
  }

  // Show modal
  modal.style.display = 'flex';
}