import os
from flask import Flask, request, jsonify, render_template
from models import db, Task 

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

@app.route('/tasks', methods=['POST', 'GET'])
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
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

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