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

async function addTask(event) {
    event.preventDefault();

    const task = document.getElementById('task').value;
    const addButton = document.querySelector('#addTaskButton');

    const originalWidth = addButton.offsetWidth;
    addButton.style.width = `${originalWidth}px`;
    addButton.disabled = true;

    let datetimeLocal = document.getElementById('datetime').value;
    
    if (datetimeLocal) {
        const localDate = new Date(datetimeLocal);
        datetimeLocal = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }
    
    const response = await fetch('/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task, priority: selectedPriority, datetime: datetimeLocal })
    });
    
    const data = await response.json();

    addButton.style.transition = "opacity 0.5s ease-in-out";
    addButton.style.opacity = "0";
    
    setTimeout(() => {
        addButton.innerHTML = '✔';
        addButton.style.opacity = "1"; 
    }, 500); 

    setTimeout(() => {
        addButton.style.opacity = "0"; 

        setTimeout(() => {
            addButton.innerHTML = 'Add Task';
            addButton.style.opacity = "1"; 
            addButton.style.width = '';
            addButton.disabled = false; 
        }, 500); 
    }, 1500); 

    document.getElementById('addTaskForm').reset();
}
