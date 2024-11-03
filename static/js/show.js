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
                // Remove the task card from the UI
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

            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: "Completed" })
            });

            if (response.ok) {
                // Remove the task card from the UI
                taskCard.remove();
            } else {
                alert('Error marking task as complete.');
            }
        });
    });
});
