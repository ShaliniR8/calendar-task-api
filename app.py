import os
from flask import Flask, request, jsonify, render_template
from models import db, Task 
from collections import defaultdict
from datetime import datetime

app = Flask(__name__)

# --- sqlite configuration ---
home_dir = os.path.expanduser("~") 
db_path = os.path.join(home_dir, 'tasks', 'tasks.db') 
os.makedirs(os.path.dirname(db_path), exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db.init_app(app)
# -----------------------------

with app.app_context():
    db.create_all()

# Function to add ordinal suffix to a day
def ordinal_suffix(day):
    if 11 <= day <= 13:
        return f"{day}th"
    suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return f"{day}{suffix}"

# Register the custom filter with Jinja2
app.jinja_env.filters['ordinal'] = ordinal_suffix

# Helper function to group tasks by month
def group_tasks_by_month(tasks):
    grouped = {}
    for task in tasks:
        month = task.datetime.strftime('%B, %Y')
        if month not in grouped:
            grouped[month] = []
        grouped[month].append(task)
    return grouped

@app.route('/new', methods=['POST', 'GET'])
def add_task():
    if request.method == 'POST':
        data = request.get_json()
        new_task = Task(task=data['task'], status=data['status'], priority=data.get('priority', 1))
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task added successfully'}), 201
    else:
        return render_template('form.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    # Retrieve all tasks and group by upcoming and overdue
    current_date = datetime.now()
    all_tasks = Task.query.all()
    
    # Separate tasks into upcoming and overdue based on the current date
    upcoming_tasks = [task for task in all_tasks if task.datetime >= current_date]
    overdue_tasks = [task for task in all_tasks if task.datetime < current_date]
    
    # Group tasks by month
    upcoming_tasks_by_month = group_tasks_by_month(upcoming_tasks)
    overdue_tasks_by_month = group_tasks_by_month(overdue_tasks)
    
    # Pass both upcoming and overdue grouped tasks to the template
    return render_template(
        'show.html', 
        upcoming_tasks=upcoming_tasks_by_month, 
        overdue_tasks=overdue_tasks_by_month
    )

@app.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get_or_404(id)
    return jsonify(task.to_dict())

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    task_item = Task.query.get_or_404(id)
    task_item.task = data.get('task', task_item.task)
    task_item.status = data.get('status', task_item.status)
    task_item.priority = data.get('priority', task_item.priority)
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task_item = Task.query.get_or_404(id)
    db.session.delete(task_item)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)