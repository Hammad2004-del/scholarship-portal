# Scholarship Portal 🎓

A full-stack scholarship management system that allows students to submit scholarship applications and renewals, while administrators can review and manage applications.

## Features

### Student
- Student registration and login
- Secure JWT authentication
- Submit fresh scholarship applications
- Submit scholarship renewals
- Upload academic records and reference letters
- View application status
- View renewal status
- Refresh application status

### Admin
- Secure admin authentication
- Admin dashboard
- View registered students
- View fresh scholarship applications
- View scholarship renewals
- Approve applications
- Reject applications
- View uploaded documents

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer

### Database
- MySQL

## Project Structure

```text
Scholarship Portal
│
├── Frontend
│   ├── Login
│   ├── Student Dashboard
│   ├── Fresh Application
│   ├── Renewal
│   └── Admin Dashboard
│
└── Backend
    ├── routes
    ├── middleware
    ├── uploads
    ├── sql
    ├── db.js
    └── server.js