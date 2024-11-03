document.addEventListener('DOMContentLoaded', function () {
    // Handle deleting a task
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', async function (event) {
            const taskCard = event.target.closest('.task-item');
            const taskId = taskCard.getAttribute('data-task-id');

            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                taskCard.remove();
            } else {
                alert('Error deleting task.');
            }
        });
    });

    // Handle completing a task
    document.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', async function (event) {
            const taskCard = event.target.closest('.task-item');
            const taskId = taskCard.getAttribute('data-task-id');
            const completionDate = new Date().toISOString();
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: "Completed", completion_date: completionDate })
            });

            if (response.ok) {
                taskCard.remove();

                const dateObj = new Date(completionDate);
                const options = { month: 'long', year: 'numeric' };
                const completedMonth = (dateObj.toLocaleDateString('en-US', options)).split(' ').join(', ');

                const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let completedTab = document.getElementById('completed');
                debugger
                let monthSection = completedTab.querySelector(`[data-target='#completed-month-${completedMonth}']`).closest('.month-section');
                if (!monthSection) {
                    monthSection = document.createElement('div');
                    monthSection.classList.add('month-section');
   
                    monthSection.innerHTML = `
                        <div class="month-header d-flex justify-content-between align-items-center bg-secondary p-2">
                            <h5 class="m-0">${completedMonth}</h5>
                            <button class="btn btn-link text-white" data-toggle="collapse" data-target="#completed-month-${completedMonth}" aria-expanded="true">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <div id="completed-month-${formattedTime}" class="collapse show"></div>
                    `;
                    completedTab.appendChild(monthSection);
                }

                const monthCollapse = monthSection.querySelector('.collapse');

                const completedTaskCard = document.createElement('div');
                completedTaskCard.classList.add('task-card', 'd-flex', 'align-items-center', 'bg-dark', 'p-2', 'mt-2');
                completedTaskCard.innerHTML = `
                    <div class="priority-label d-flex align-items-center mr-3">
                        <div class="priority-circle ${taskCard.querySelector('.priority-circle').classList[1]} mr-2"></div>
                        <span class="priority-text">${taskCard.querySelector('.priority-text').textContent}</span>
                    </div>

                    <div class="task-details flex-grow-1">
                        <h6 class="m-0">${taskCard.querySelector('.task-details h6').textContent}</h6>
                        <small>${formattedTime}</small>
                    </div>

                    <div class="date-box text-center bg-secondary p-2">
                        <h3 class="m-0">${dateObj.getDate()}</h3>
                        <small>${dateObj.toLocaleDateString('en-US', { weekday: 'long' })}</small>
                    </div>
                `;

                monthCollapse.appendChild(completedTaskCard);
            } else {
                alert('Error marking task as complete.');
            }
        });
    });
});
