# 🎬 Movie Booking Application

A full-stack MERN (MongoDB, Express, React/Next.js, Node.js) web application for booking movie tickets, managing theatres, and scheduling shows. It features role-based access for Customers, Theatre Owners, and Admins.

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [License](#-license)

## ⭐ Features

### 👤 User Features
- **Authentication**: Secure Signup & Login with JWT.
- **Browse Movies**: View currently running movies.
- **Theatre Selection**: Choose theatres showing specific movies.
- **Seat Booking**: Interactive seat selection.
- **Payment Simulation**: Simulated payment flow for booking confirmation.
- **Booking History**: View past and upcoming bookings.
- **Profile Management**: Update user details.

### 🏟️ Theatre Owner Features
- **Dashboard**: Manage owned theatres.
- **Show Management**: Create and schedule shows for movies.
- **Theatre Management**: Update theatre details.

### 🛡️ Admin Features
- **User Management**: Manage users and roles.
- **Movie Management**: Add, update, or delete movies system-wide.
- **Theatre Approval**: Oversee theatre listings.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF (for booking receipts)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcrypt
- **Architecture**: MVC with separate Service layer
- **Communication**: Axios for internal service calls

### Microservices
- **Notification Service**: Separate service for handling email notifications.

## 📂 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Movie-Booking
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend/frontend
   npm install
   ```

## 🔑 Environment Variables

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
DB_URL=mongodb://localhost/mb_db  # Or your MongoDB Atlas URL
AUTH_KEY=your_secret_key
NOTI_SERVICE=http://localhost:3001 # URL of your notification service
FRONTEND_URL=http://localhost:3000
```

Create a `.env.local` file in the `frontend/frontend` directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## 🚀 Running the Project

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```

2. **Start the Frontend Application**
   ```bash
   cd frontend/frontend
   npm run dev
   ```

3. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
