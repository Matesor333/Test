
// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
  // Calendar elements
  const calendarTitle = document.getElementById('calendar-title');
  const monthGrid = document.getElementById('month-grid');
  const weekGrid = document.getElementById('week-grid');
  const dayGrid = document.getElementById('day-grid');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const todayBtn = document.getElementById('today-btn');
  const viewBtns = document.querySelectorAll('.view-btn');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskModal = document.getElementById('task-modal');
  const taskForm = document.getElementById('task-form');
  const cancelTaskBtn = document.getElementById('cancel-task');
  const taskClientSelect = document.getElementById('task-client');

  // Calendar state
  let currentDate = new Date();
  let currentView = 'month';
  let tasks = [];

  // Initialize calendar
  function initCalendar() {
    renderCalendarView();
    bindEvents();
    populateClientSelect();
  }

  // Load tasks from mock data (in a real app, this would come from API)
  function loadTasks() {
    // Mock data for tasks
    tasks = [
      {
        id: 1,
        title: 'Training session with John',
        description: 'Focus on upper body',
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 10, 0),
        duration: 60, // minutes
        clientId: 1,
        color: '#1a73e8'
      },
      {
        id: 2,
        title: 'Nutrition consultation',
        description: 'Review meal plan progress',
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 14, 30),
        duration: 45, // minutes
        clientId: 2,
        color: '#4ecdc4'
      },
      {
        id: 3,
        title: 'Team meeting',
        description: 'Weekly staff meeting',
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, 9, 0),
        duration: 60, // minutes
        clientId: null,
        color: '#ff6b6b'
      }
    ];
  }

  // Populate client select dropdown
  function populateClientSelect() {
    // Get clients from the global clients array (assumed to be populated elsewhere)
    if (typeof clients !== 'undefined' && clients.length > 0) {
      taskClientSelect.innerHTML = '<option value="">None</option>';
      clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        taskClientSelect.appendChild(option);
      });
    }
  }

  // Render the current calendar view
  function renderCalendarView() {
    updateCalendarTitle();
    
    switch (currentView) {
      case 'month':
        renderMonthView();
        break;
      case 'week':
        renderWeekView();
        break;
      case 'day':
        renderDayView();
        break;
    }
  }

  // Update the calendar title based on the current view and date
  function updateCalendarTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    switch (currentView) {
      case 'month':
        calendarTitle.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        break;
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          calendarTitle.textContent = `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        } else {
          calendarTitle.textContent = `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
        }
        break;
      case 'day':
        calendarTitle.textContent = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
        break;
    }
  }

  // Render month view
  function renderMonthView() {
    monthGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const dayElement = createDayElement(prevMonthLastDay - startingDayOfWeek + i + 1, true);
      dayElement.dataset.date = formatDate(new Date(year, month - 1, prevMonthLastDay - startingDayOfWeek + i + 1));
      monthGrid.appendChild(dayElement);
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getDate() === i && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      
      const dayElement = createDayElement(i, false, isToday);
      dayElement.dataset.date = formatDate(new Date(year, month, i));
      monthGrid.appendChild(dayElement);
      
      // Add tasks for this day
      const date = new Date(year, month, i);
      addTasksToDay(dayElement, date);
    }
    
    // Next month's days
    const totalDaysDisplayed = startingDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalDaysDisplayed; // 6 rows of 7 days = 42 cells
    
    for (let i = 1; i <= remainingCells; i++) {
      const dayElement = createDayElement(i, true);
      dayElement.dataset.date = formatDate(new Date(year, month + 1, i));
      monthGrid.appendChild(dayElement);
    }
  }

  // Create a day element for the month view
  function createDayElement(dayNumber, isOtherMonth, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'month-day';
    if (isOtherMonth) dayElement.classList.add('other-month');
    if (isToday) dayElement.classList.add('today');
    
    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'day-tasks';
    
    dayElement.appendChild(dayNumberElement);
    dayElement.appendChild(tasksContainer);
    
    return dayElement;
  }

  // Add tasks to a day element
  function addTasksToDay(dayElement, date) {
    const tasksContainer = dayElement.querySelector('.day-tasks');
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return taskDate.getDate() === date.getDate() && 
             taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    });
    
    dayTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      taskElement.style.backgroundColor = task.color;
      taskElement.dataset.taskId = task.id;
      
      const startTime = formatTime(task.startTime);
      taskElement.textContent = `${startTime} ${task.title}`;
      
      taskElement.addEventListener('click', () => openTaskModal(task));
      
      tasksContainer.appendChild(taskElement);
    });
  }

  // Render week view
  function renderWeekView() {
    weekGrid.innerHTML = '';
    
    // Create time column
    for (let hour = 0; hour < 24; hour++) {
      const timeCell = document.createElement('div');
      timeCell.className = 'hour-cell time-label';
      timeCell.textContent = formatHour(hour);
      weekGrid.appendChild(timeCell);
      
      // Create day cells for this hour
      for (let day = 0; day < 7; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'hour-cell';
        weekGrid.appendChild(dayCell);
      }
    }
    
    // Add tasks to week view
    addTasksToWeekView();
  }

  // Add tasks to week view
  function addTasksToWeekView() {
    // Get the week boundaries
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    // Filter tasks for this week
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return taskDate >= weekStart && taskDate < weekEnd;
    });
    
    // Add tasks to the grid
    weekTasks.forEach(task => {
      const taskDate = new Date(task.startTime);
      const dayOfWeek = taskDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hours = taskDate.getHours();
      const minutes = taskDate.getMinutes();
      
      // Calculate position
      const top = (hours * 50) + (minutes / 60 * 50); // 50px per hour
      const height = (task.duration / 60) * 50; // Convert minutes to hours, then to pixels
      const left = (dayOfWeek + 1) * 100; // 100px per day column, +1 for time column
      
      // Create task element
      const taskElement = document.createElement('div');
      taskElement.className = 'week-event';
      taskElement.dataset.taskId = task.id;
      taskElement.style.top = `${top}px`;
      taskElement.style.height = `${height}px`;
      taskElement.style.width = `calc(100% / 7 - 16px)`;
      taskElement.style.left = `${left}px`;
      taskElement.style.backgroundColor = task.color;
      
      const startTime = formatTime(task.startTime);
      taskElement.innerHTML = `
        <div class="task-time">${startTime}</div>
        <div class="task-title">${task.title}</div>
      `;
      
      taskElement.addEventListener('click', () => openTaskModal(task));
      
      weekGrid.appendChild(taskElement);
    });
  }

  // Render day view
  function renderDayView() {
    dayGrid.innerHTML = '';
    
    // Create time column and hour cells
    for (let hour = 0; hour < 24; hour++) {
      const timeCell = document.createElement('div');
      timeCell.className = 'hour-cell time-label';
      timeCell.textContent = formatHour(hour);
      dayGrid.appendChild(timeCell);
      
      const hourCell = document.createElement('div');
      hourCell.className = 'hour-cell';
      dayGrid.appendChild(hourCell);
    }
    
    // Add tasks to day view
    addTasksToDayView();
  }

  // Add tasks to day view
  function addTasksToDayView() {
    // Create a new date with the same year, month, and day as currentDate, but with hours, minutes, seconds, and milliseconds set to 0
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    
    // Filter tasks for this day
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.startTime);
      return taskDate >= dayStart && taskDate < dayEnd;
    });
    
    // Add tasks to the grid
    dayTasks.forEach(task => {
      const taskDate = new Date(task.startTime);
      const hours = taskDate.getHours();
      const minutes = taskDate.getMinutes();
      
      // Calculate position
      const top = (hours * 50) + (minutes / 60 * 50); // 50px per hour
      const height = (task.duration / 60) * 50; // Convert minutes to hours, then to pixels
      
      // Create task element
      const taskElement = document.createElement('div');
      taskElement.className = 'day-event';
      taskElement.dataset.taskId = task.id;
      taskElement.style.top = `${top}px`;
      taskElement.style.height = `${height}px`;
      taskElement.style.width = `calc(100% - 90px)`;
      taskElement.style.backgroundColor = task.color;
      
      const startTime = formatTime(task.startTime);
      taskElement.innerHTML = `
        <div class="task-time">${startTime}</div>
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description || ''}</div>
      `;
      
      taskElement.addEventListener('click', () => openTaskModal(task));
      
      dayGrid.appendChild(taskElement);
    });
  }

  // Bind event listeners
  function bindEvents() {
    // Navigation buttons
    prevBtn.addEventListener('click', navigatePrevious);
    nextBtn.addEventListener('click', navigateNext);
    todayBtn.addEventListener('click', navigateToday);
    
    // View buttons
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        
        // Update active button
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active view
        document.querySelectorAll('.calendar-view').forEach(view => {
          view.classList.remove('active');
        });
        document.getElementById(`${currentView}-view`).classList.add('active');
        
        renderCalendarView();
      });
    });
    
    // Add task button
    addTaskBtn.addEventListener('click', () => openTaskModal());
    
    // Close modal buttons
    const closeButtons = taskModal.querySelectorAll('.close-modal, #cancel-task');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeTaskModal);
    });
    
    // Form submission
    taskForm.addEventListener('submit', handleTaskSubmit);
  }

  // Navigate to previous period
  function navigatePrevious() {
    switch (currentView) {
      case 'month':
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case 'day':
        currentDate.setDate(currentDate.getDate() - 1);
        break;
    }
    renderCalendarView();
  }

  // Navigate to next period
  function navigateNext() {
    switch (currentView) {
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'day':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
    }
    renderCalendarView();
  }

  // Navigate to today
  function navigateToday() {
    currentDate = new Date();
    renderCalendarView();
  }

  // Open task modal
  function openTaskModal(task = null) {
    const modalTitle = document.getElementById('task-modal-title');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-description');
    const taskDateInput = document.getElementById('task-date');
    const taskStartTimeInput = document.getElementById('task-start-time');
    const taskDurationHours = document.getElementById('task-duration-hours');
    const taskDurationMinutes = document.getElementById('task-duration-minutes');
    const taskColorOptions = document.querySelectorAll('input[name="task-color"]');
    
    if (task) {
      // Edit existing task
      modalTitle.textContent = 'Edit Task';
      taskForm.dataset.taskId = task.id;
      
      taskTitleInput.value = task.title;
      taskDescInput.value = task.description || '';
      
      const taskDate = new Date(task.startTime);
      taskDateInput.value = formatDate(taskDate);
      taskStartTimeInput.value = padZero(taskDate.getHours()) + ':' + padZero(taskDate.getMinutes());
      
      const durationHours = Math.floor(task.duration / 60);
      const durationMinutes = task.duration % 60;
      taskDurationHours.value = durationHours;
      taskDurationMinutes.value = durationMinutes;
      
      if (task.clientId) {
        taskClientSelect.value = task.clientId;
      } else {
        taskClientSelect.value = '';
      }
      
      // Set the color
      taskColorOptions.forEach(option => {
        if (option.value === task.color) {
          option.checked = true;
        }
      });
    } else {
      // Add new task
      modalTitle.textContent = 'Add New Task';
      taskForm.dataset.taskId = '';
      
      taskTitleInput.value = '';
      taskDescInput.value = '';
      
      // Default to current date and time
      const now = new Date();
      taskDateInput.value = formatDate(now);
      
      // Round to nearest 15 minutes
      const minutes = Math.ceil(now.getMinutes() / 15) * 15;
      now.setMinutes(minutes);
      taskStartTimeInput.value = padZero(now.getHours()) + ':' + padZero(minutes % 60);
      
      taskDurationHours.value = 1;
      taskDurationMinutes.value = 0;
      
      taskClientSelect.value = '';
      
      // Default color
      taskColorOptions[0].checked = true;
    }
    
    taskModal.classList.add('show');
  }

  // Close task modal
  function closeTaskModal() {
    taskModal.classList.remove('show');
  }

  // Handle task form submission
  function handleTaskSubmit(event) {
    event.preventDefault();
    
    const taskId = taskForm.dataset.taskId;
    const taskTitle = document.getElementById('task-title').value;
    const taskDesc = document.getElementById('task-description').value;
    const taskDate = document.getElementById('task-date').value;
    const taskStartTime = document.getElementById('task-start-time').value;
    const taskDurationHours = parseInt(document.getElementById('task-duration-hours').value) || 0;
    const taskDurationMinutes = parseInt(document.getElementById('task-duration-minutes').value) || 0;
    const taskClientId = document.getElementById('task-client').value;
    const taskColor = document.querySelector('input[name="task-color"]:checked').value;
    
    // Create date object from inputs
    const [year, month, day] = taskDate.split('-').map(Number);
    const [hours, minutes] = taskStartTime.split(':').map(Number);
    const startTime = new Date(year, month - 1, day, hours, minutes);
    
    // Calculate total duration in minutes
    const duration = (taskDurationHours * 60) + taskDurationMinutes;
    
    // Create task object
    const task = {
      title: taskTitle,
      description: taskDesc,
      startTime: startTime,
      duration: duration,
      clientId: taskClientId ? parseInt(taskClientId) : null,
      color: taskColor
    };
    
    if (taskId) {
      // Update existing task
      task.id = parseInt(taskId);
      const index = tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks[index] = task;
      }
    } else {
      // Add new task
      task.id = Math.max(0, ...tasks.map(t => t.id)) + 1;
      tasks.push(task);
    }
    
    // Close modal and refresh calendar
    closeTaskModal();
    renderCalendarView();
  }

  // Helper functions
  function formatDate(date) {
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  }
  
  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${padZero(minutes)} ${ampm}`;
  }
  
  function formatHour(hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${ampm}`;
  }
  
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  // Load tasks and initialize calendar
  loadTasks();
  initCalendar();
});
