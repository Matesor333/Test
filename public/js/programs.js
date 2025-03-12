
document.addEventListener('DOMContentLoaded', function() {
  // Programs page functionality
  const addProgramBtn = document.getElementById('add-program-btn');
  const programsGrid = document.getElementById('programs-grid');
  const programTypeFilter = document.getElementById('program-type-filter');
  const programSort = document.getElementById('program-sort');
  
  // Sample program data - in a real app this would come from an API
  const programs = [
    { id: 1, name: 'Strength Builder', type: 'strength', description: 'Build muscle and increase strength', createdAt: '2023-08-10' },
    { id: 2, name: 'Fat Loss HIIT', type: 'hiit', description: 'High intensity interval training for maximum fat loss', createdAt: '2023-07-15' },
    { id: 3, name: 'Cardio Blast', type: 'cardio', description: 'Improve cardiovascular health and endurance', createdAt: '2023-09-05' },
    { id: 4, name: 'Flexibility & Mobility', type: 'flexibility', description: 'Increase range of motion and prevent injuries', createdAt: '2023-08-28' }
  ];
  
  // Render programs in grid
  function renderPrograms(programsList) {
    if (!programsGrid) return;
    
    programsGrid.innerHTML = '';
    
    if (programsList.length === 0) {
      programsGrid.innerHTML = '<div class="no-items">No programs found</div>';
      return;
    }
    
    programsList.forEach(program => {
      const programCard = document.createElement('div');
      programCard.className = 'program-card';
      programCard.dataset.id = program.id;
      
      programCard.innerHTML = `
        <div class="program-card-header">
          <h3>${program.name}</h3>
          <span class="program-type">${program.type}</span>
        </div>
        <p>${program.description}</p>
        <div class="program-card-footer">
          <span>Created: ${formatDate(program.createdAt)}</span>
          <div class="program-actions">
            <button class="btn-icon edit-program" data-id="${program.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon delete-program" data-id="${program.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      
      programsGrid.appendChild(programCard);
    });
  }
  
  // Filter and sort programs
  function filterAndSortPrograms() {
    if (!programTypeFilter || !programSort) return;
    
    const type = programTypeFilter.value;
    const sort = programSort.value;
    
    let filteredPrograms = [...programs];
    
    // Apply type filter
    if (type !== 'all') {
      filteredPrograms = filteredPrograms.filter(p => p.type === type);
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        filteredPrograms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filteredPrograms.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name-asc':
        filteredPrograms.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredPrograms.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    renderPrograms(filteredPrograms);
  }
  
  // Format date helper
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  // Event listeners
  if (programTypeFilter) {
    programTypeFilter.addEventListener('change', filterAndSortPrograms);
  }
  
  if (programSort) {
    programSort.addEventListener('change', filterAndSortPrograms);
  }
  
  // Initialize
  renderPrograms(programs);
});
