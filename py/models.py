from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    datetime = db.Column(db.DateTime, default=datetime.utcnow)
    task = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.Integer, nullable=False, default=0)  # New column with default value

    def to_dict(self):
        return {
            'id': self.id,
            'datetime': self.datetime.isoformat(),
            'task': self.task,
            'status': self.status,
            'priority': self.priority  # Include priority in the output
        }
