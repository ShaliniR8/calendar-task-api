import os
import bcrypt
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from models import db, Task 
from collections import defaultdict
from bson.objectid import ObjectId
from datetime import datetime, timezone
from pymongo import MongoClient
from dotenv import load_dotenv

app = Flask(__name__)

# ---- MONGODB ------------------

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["atm0sCal"]
tasks_collection = db["tasks"]
users_collection = db["users"]

# -------------------------------
app.secret_key = os.urandom(24)
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/auth', methods=['POST'])
def auth():
    username = request.form['username']
    password = request.form['password']
    action = request.form['action']

    if action == "register":
        if users_collection.find_one({"username": username}):
            return "User already exists!", 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users_collection.insert_one({
            "username": username,
            "password": hashed_password.decode('utf-8')
        })

    # login
    user = users_collection.find_one({"username": username})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return "Invalid username or password!", 401

    user_obj = User(user["_id"])  # Assuming User class is already defined
    login_user(user_obj)
    return redirect(url_for('add_task'))

@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/new', methods=['POST', 'GET'])
def add_task():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    if request.method == 'POST':
        data = request.get_json()
        datetime_str = data.get('datetime')
        task_datetime = datetime.fromisoformat(datetime_str).astimezone(timezone.utc) if datetime_str else None
        new_task = {"task": data['task'], "status": "Upcoming", "priority": data.get("priority", 1), "datetime": task_datetime, "user_id": str(current_user.id)}
        tasks_collection.insert_one(new_task)

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
        task_date = task["datetime"]
        if isinstance(task_date, str):  # If datetime is stored as string
            task_date = datetime.fromisoformat(task_date)
        task['time'] = task_date.strftime("%I:%M %p")
        task['date'] = task_date.strftime("%d")
        task['day'] = task_date.strftime("%A")
        month = task_date.strftime('%B, %Y')
        if month not in grouped:
            grouped[month] = []
        grouped[month].append(task)
    return grouped


@app.route('/tasks', methods=['GET'])
def get_tasks():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    current_date = datetime.now()

    upcoming_tasks = list(tasks_collection.find({
        "user_id": str(current_user.id),
        "datetime": {"$gte": current_date},
        "status": {"$ne": "Completed"}
    }))

    overdue_tasks = list(tasks_collection.find({
        "user_id": str(current_user.id),
        "datetime": {"$lt": current_date},
        "status": {"$ne": "Completed"}
    }))

    completed_tasks = list(tasks_collection.find({
        "user_id": str(current_user.id),
        "status": "Completed"
    }))

    upcoming_tasks_by_month = group_tasks_by_month(upcoming_tasks)
    overdue_tasks_by_month = group_tasks_by_month(overdue_tasks)
    completed_tasks_by_month = group_tasks_by_month(completed_tasks)

    return render_template(
        'show.html',
        upcoming_tasks=upcoming_tasks_by_month,
        overdue_tasks=overdue_tasks_by_month,
        completed_tasks=completed_tasks_by_month
    )

@app.route('/tasks/<string:id>', methods=['GET'])
def get_task(id):
    if not current_user.is_authenticated:
        return redirect(url_for('login'))
    task = tasks_collection.find_one({"_id": ObjectId(id), "user_id": str(current_user.id)})
    if not task:
        return jsonify({"error": "Task not found"}), 404
    task["_id"] = str(task["_id"]) 
    return jsonify(task)

@app.route('/tasks/<string:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    tasks_collection.update_one({"_id": ObjectId(id)}, {"$set": {"status": data.get("status"), "datetime": data.get("completion_date")}})
    return jsonify({'message': 'Task updated successfully'})

@app.route('/tasks/<string:id>', methods=['DELETE'])
def delete_task(id):
    tasks_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)