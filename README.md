# Task Manager Flask App

A simple Flask application that allows you to create, store, and query tasks using a SQLite database. Each task has a `datetime`, `task`, and `status` field.

## Table of Contents

- [Features](#features)
- [Endpoints](#endpoints)

## Features

- Add new tasks with a description and status.
- Retrieve all tasks or a specific task by ID.
- Update existing tasks.
- Delete tasks.
- Uses SQLite for data storage.
- API follows RESTful principles.

## Endpoints

### 1. Create a New Task

- **URL**: `/tasks`
- **Method**: `POST`
- **Request Body** (JSON):
  ```
  {
    "task": "Task description here",
    "status": "Task status here"
  }
  ```
- **Response** (201 Created):
  ```
  {
    "message": "Task added successfully"
  }
  ```

### 2. Retrieve All Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Response** (200 OK):
  ```
  [
    {
      "id": 1,
      "datetime": "2023-10-05T12:34:56.789123",
      "task": "Task description here",
      "status": "Task status here"
    },
    ...
  ]
  ```

### 3. Retrieve a Task by ID

- **URL**: `/tasks/<int:id>`
- **Method**: `GET`
- **Response** (200 OK):
  ```
  {
    "id": 1,
    "datetime": "2023-10-05T12:34:56.789123",
    "task": "Task description here",
    "status": "Task status here"
  }
  ```

### 4. Update a Task

- **URL**: `/tasks/<int:id>`
- **Method**: `PUT`
- **Request Body** (JSON):
  ```
  {
    "task": "Updated task description",
    "status": "Updated task status"
  }
  ```
- **Response** (200 OK):
  ```
  {
    "message": "Task updated successfully"
  }
  ```

### 5. Delete a Task

- **URL**: `/tasks/<int:id>`
- **Method**: `DELETE`
- **Response** (200 OK):
  ```
  {
    "message": "Task deleted successfully"
  }
  ```
