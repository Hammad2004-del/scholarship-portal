# 🎓 Scholarship Management Portal

A full-stack web-based Scholarship Management Portal designed to simplify the process of scholarship applications, renewals, document submission, and administrative review.

The system provides separate functionality for students and administrators, with secure authentication and a MySQL database for managing application data.

---

## 🚀 Features

### 👨‍🎓 Student Features

- Student registration and login
- Secure JWT-based authentication
- Student dashboard
- Submit fresh scholarship applications
- Submit scholarship renewal applications
- Upload academic records and reference documents
- View fresh application status
- View renewal status
- Refresh application status
- Secure access to student-specific information

### 👨‍💼 Admin Features

- Secure administrator authentication
- Admin dashboard
- View registered students
- View fresh scholarship applications
- View scholarship renewals
- Approve scholarship applications
- Reject scholarship applications
- View uploaded student documents

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- JWT Authentication
- Multer

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 📂 Project Structure

```text
Scholarship Portal/
│
├── middleware/
│   └── verifyToken.js
│
├── routes/
│   ├── admin.js
│   ├── applications.js
│   └── auth.js
│
├── sql/
│   └── schema.sql
│
├── uploads/
│   └── .gitkeep
│
├── AdminDashboard.html
├── AdminLogin.html
├── Freshform.html
├── Renewal.html
├── RenewalForm.html
├── Scholarship.html
├── dashboard2.html
│
├── createAdmin.js
├── db.js
├── disburse.js
├── fresh.js
├── renew.js
│
├── server.js
├── portal.css
│
├── package.json
├── package-lock.json
│
├── .env.example
├── .gitignore
└── README.md
