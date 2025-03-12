
document.addEventListener('DOMContentLoaded', function() {
  // Client Growth Chart
  const clientGrowthCtx = document.getElementById('clientGrowthChart').getContext('2d');
  
  const clientGrowthChart = new Chart(clientGrowthCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [{
        label: 'Total Clients',
        data: [2, 5, 7, 10, 12, 15, 18, 22, 25],
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(100, 181, 246, 0.2)',
        borderWidth: 2,
        tension: 0.4,
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
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
  
  // Session Distribution Chart
  const sessionDistributionCtx = document.getElementById('sessionDistributionChart').getContext('2d');
  
  const sessionDistributionChart = new Chart(sessionDistributionCtx, {
    type: 'doughnut',
    data: {
      labels: ['Weight Loss', 'Muscle Building', 'General Fitness', 'Rehabilitation'],
      datasets: [{
        label: 'Session Types',
        data: [45, 30, 15, 10],
        backgroundColor: [
          '#1a73e8',
          '#4ecdc4',
          '#64b5f6',
          '#0d47a1'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: false
        }
      },
      cutout: '70%'
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard charts
  function initDashboardCharts() {
    const clientGrowthChart = document.getElementById('clientGrowthChart');
    const sessionDistributionChart = document.getElementById('sessionDistributionChart');
    
    if (clientGrowthChart) {
      new Chart(clientGrowthChart, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          datasets: [{
            label: 'New Clients',
            data: [2, 3, 5, 4, 6, 8, 7, 9, 12],
            borderColor: '#1a73e8',
            backgroundColor: 'rgba(26, 115, 232, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    
    if (sessionDistributionChart) {
      new Chart(sessionDistributionChart, {
        type: 'doughnut',
        data: {
          labels: ['Weight Training', 'Cardio', 'HIIT', 'Flexibility'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#1a73e8', '#4ecdc4', '#ff6b6b', '#ffa500']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }
  }
  
  // Initialize weight progress chart on client details page
  function initClientWeightChart() {
    const weightProgressChart = document.getElementById('weightProgressChart');
    
    if (weightProgressChart) {
      // The data will be populated in client-details.js
      // This is just a fallback if the chart wasn't already initialized
      if (!weightProgressChart.chart) {
        new Chart(weightProgressChart, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Weight (kg)',
              data: [],
              borderColor: '#1a73e8',
              backgroundColor: 'rgba(26, 115, 232, 0.1)',
              tension: 0.2,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  }
  
  // Initialize charts based on the current page
  const dashboardPage = document.getElementById('dashboard-page');
  const clientDetailsPage = document.getElementById('client-details-page');
  
  if (dashboardPage && dashboardPage.classList.contains('active')) {
    initDashboardCharts();
  }
  
  if (clientDetailsPage && clientDetailsPage.classList.contains('active')) {
    initClientWeightChart();
  }
});
