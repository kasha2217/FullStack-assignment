# 📅Student Vaccine Tracker (Full Stack Assignment)

A full-stack web application to manage vaccination drives for students, allowing admins to create drives, track student vaccination status, and perform bulk imports. Built with **React (Frontend)** and **Node.js + Express (Backend)** with MongoDB for data storage.

## 📂 Project Structure

```
/frontend  --> React JS (Vite + Tailwind CSS)
/backend   --> Node.js + Express + MongoDB
```

---

## 🚀 Features

### ✅ Frontend (React + Vite + Tailwind)

* User login system (JWT-based auth)
* Dashboard displaying total students, vaccinated count, and pending count
* Manage Vaccination Drives (Create, Update, List)
* Manage Students (Add, Update, Vaccinate)
* Bulk Import Students via CSV file
* Responsive UI with Tailwind CSS

### ✅ Backend (Node.js + Express + MongoDB)

* **Authentication**: JWT-based login system
* **Student Management**: CRUD APIs for students and vaccination updates
* **Drive Management**: APIs for creating and managing vaccination drives
* **Dashboard Metrics**: API to get student/vaccination summary
* **CSV Import**: Bulk import students using CSV
* Protected routes with authentication middleware

---

## ⚙️ Tech Stack

| Frontend          | Backend                    |
| ----------------- | -------------------------- |
| React + Vite      | Node.js + Express          |
| Tailwind CSS      | MongoDB (Mongoose)         |
| Axios (API calls) | JWT (Auth) + Bcrypt (Hash) |
| React Hook Form   | Multer (CSV Upload)        |

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kasha2217/FullStack-assignment-student-vaccine-tracker.git
cd FullStack-assignment-student-vaccine-tracker
```

---

### 2. Backend Setup (`/backend`)

```bash
cd backend
npm install
```

#### Create `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### Run the server:

```bash
npm run dev
```

Backend will run at: **[http://localhost:5000](http://localhost:5000)**

---

### 3. Frontend Setup (`/frontend`)

```bash
cd ../frontend
npm install
```

#### Start the frontend:

```bash
npm run dev
```

Frontend will run at: **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ API Documentation

You can view API documentation using Swagger (OpenAPI) spec.

### Steps:

1. Install [Swagger UI](https://editor.swagger.io/) or use [editor.swagger.io](https://editor.swagger.io/).
2. Load the `swagger.yaml` file (provided in this repo).

---

## 🔐 Authentication Flow

* User logs in → receives JWT Token
* JWT token is sent in **Authorization** header (`Bearer <token>`)
* All protected APIs require valid token.

---

## 📊 Available API Endpoints

| Route                     | Method | Description                  |
| ------------------------- | ------ | ---------------------------- |
| `/auth/login`             | POST   | User login                   |
| `/dashboard/metrics`      | GET    | Get dashboard summary        |
| `/drives`                 | POST   | Create new vaccination drive |
| `/drives`                 | GET    | Get all drives               |
| `/drives/:id`             | PUT    | Update drive                 |
| `/students`               | POST   | Add new student              |
| `/students`               | GET    | Get all students             |
| `/students/:id`           | PUT    | Update student               |
| `/students/:id/vaccinate` | POST   | Vaccinate student            |
| `/students/import`        | POST   | Bulk import students (CSV)   |

---

## 📅 Bulk Import Format (CSV)

To import students in bulk, upload a `.csv` file with the following headers:

```csv
name,age,vaccinationStatus
John Doe,16,Not Vaccinated
Jane Smith,15,Completed
```

---

## 👩‍💻 Author

* **Kasha2217**
  GitHub: [@kasha2217](https://github.com/kasha2217)

---

## 📜 License

This project is licensed for educational and assignment use.

---
