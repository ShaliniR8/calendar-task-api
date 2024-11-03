let selectedPriority = 1;  // Default priority

function togglePriorityDropdown() {
    const options = document.getElementById('priorityOptions');
    options.style.display = options.style.display === 'flex' ? 'none' : 'flex';
}

function selectPriority(value, label, cssClass) {
    selectedPriority = value;
    document.getElementById('selectedPriorityLabel').textContent = label;
    const circle = document.getElementById('selectedPriorityCircle');
    circle.className = 'priority-circle ' + cssClass;
    togglePriorityDropdown();  // Close the dropdown
}

async function addTask() {
    const task = document.getElementById('task').value;

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task, status: "Upcoming", priority: selectedPriority })
    });
    const data = await response.json();
    alert(data.message);
    document.getElementById('addTaskForm').reset();
    // Reset priority selection to default
    selectPriority(1, 'Default', 'priority-default');
}
