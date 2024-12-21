import os
from flask import Flask, request, jsonify, render_template
from models import db, Task 
from collections import defaultdict
from datetime import datetime, timezone

app = Flask(__name__)

# --- sqlite configuration ---
home_dir = os.path.expanduser("~") 
db_path = os.path.join(home_dir, '.in-scape', 'tasks.db') 
os.makedirs(os.path.dirname(db_path), exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
db.init_app(app)
# -----------------------------

with app.app_context():
    db.create_all()

@app.route('/new', methods=['POST', 'GET'])
def add_task():
    if request.method == 'POST':
        data = request.get_json()
        datetime_str = data.get('datetime')
        task_datetime = datetime.fromisoformat(datetime_str).astimezone(timezone.utc) if datetime_str else None
        new_task = Task(task=data['task'], status='Upcoming', priority=data.get('priority', 1), datetime=task_datetime)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task added successfully'}), 201
    else:
        return render_template('form.html', datetime = datetime)

def ordinal_suffix(day):
    if 11 <= day <= 13:
        return f"{day}th"
    suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return f"{day}{suffix}"

app.jinja_env.filters['ordinal'] = ordinal_suffix

def group_tasks_by_month(tasks):
    grouped = {}
    for task in tasks:
        month = task.datetime.strftime('%B, %Y')
        if month not in grouped:
            grouped[month] = []
        grouped[month].append(task)
    return grouped

@app.route('/tasks', methods=['GET'])
def get_tasks():
    current_date = datetime.now()
    all_tasks = Task.query.all()

    upcoming_tasks = [task for task in all_tasks if task.datetime >= current_date and task.status != "Completed"]
    overdue_tasks = [task for task in all_tasks if task.datetime < current_date and task.status != "Completed"]
    completed_tasks = [task for task in all_tasks if task.status == "Completed"]

    upcoming_tasks_by_month = group_tasks_by_month(upcoming_tasks)
    overdue_tasks_by_month = group_tasks_by_month(overdue_tasks)
    completed_tasks_by_month = group_tasks_by_month(completed_tasks)

    return render_template(
        'show.html',
        upcoming_tasks=upcoming_tasks_by_month,
        overdue_tasks=overdue_tasks_by_month,
        completed_tasks=completed_tasks_by_month
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
    task_item.datetime = data.get('priority', task_item.datetime)
      
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