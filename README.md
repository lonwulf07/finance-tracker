# 💸 Finance Flow

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

> A full-stack, mobile-first Progressive Web Application (PWA) built to track personal finances, visualize spending habits, and actively detect unusual account activity using a custom Machine Learning microservice.

---

## 📸 Overview

*(Add a screenshot of your beautiful Dark Mode/Glassmorphism UI here once deployed)*
`![Dashboard Screenshot](/frontend/public/screenshot.png)`

## ✨ Core Features

* **🛡️ Secure Multi-User Architecture:** Complete JWT-based authentication system with encrypted passwords using `bcryptjs`.
* **📱 Progressive Web App (PWA):** Fully installable on iOS and Android devices directly from the browser, achieving a native mobile app feel.
* **🧠 Smart Anomaly Detection:** A dedicated Python microservice running a multivariate Isolation Forest algorithm to automatically flag highly unusual spending patterns based on amount and category context.
* **📊 Interactive Data Visualization:** Real-time, animated pie charts breaking down expenses by category using Recharts and Framer Motion.
* **📁 CSV Export:** Instantly generate and download spreadsheet reports of your financial history.

## 🛠️ Technical Stack

**Frontend (Client)**
* **Core:** React 18, Vite
* **State & Data:** Context API, Axios
* **UI/UX:** Framer Motion, Recharts
* **PWA:** vite-plugin-pwa

**Backend (API)**
* **Environment:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** JSON Web Tokens (JWT), CORS

**Machine Learning (Microservice)**
* **Environment:** Python 3.10
* **API Framework:** Flask
* **Data Science:** scikit-learn (Isolation Forest), pandas, numpy

---

## 🚀 Local Installation & Setup

This repository is structured as a monorepo containing three distinct services. You will need three terminal windows to run the application locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/finance-flow.git](https://github.com/your-username/finance-flow.git)
cd finance-flow
```

### 2. Setup the Backend (Node/Express)
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the server:
```bash
npm run dev
```

### 3. Setup the Machine Learning Service (Python/Flask)
Open a new terminal and navigate to the ML service:
```bash
cd anomaly-service
python -m venv venv
```
Activate the virtual environment:
* **Windows:** `venv\Scripts\activate`
* **Mac/Linux:** `source venv/bin/activate`

Install dependencies:
```bash
pip install flask pymongo scikit-learn pandas python-dotenv flask-cors
```
Create a `.env` file in the `/anomaly-service` directory:
```env
MONGO_URI=your_mongodb_connection_string
```
Start the microservice:
```bash
python app.py
```

### 4. Setup the Frontend (React/Vite)
Open a third terminal and navigate to the frontend:
```bash
cd frontend
npm install --legacy-peer-deps
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📂 Architecture Tree

```text
finance-flow/
├── anomaly-service/       # Python Flask ML Microservice
│   ├── app.py             # Isolation Forest logic & API routes
│   └── .env               
├── backend/               # Node.js Express API
│   ├── controllers/       # Auth & Transaction logic
│   ├── middleware/        # JWT Protection
│   ├── models/            # Mongoose Schemas
│   ├── routes/            
│   ├── server.js          
│   └── .env               
└── frontend/              # React Vite App
    ├── public/            # PWA Icons & Manifest
    ├── src/               
    │   ├── api/           # Axios interceptors
    │   ├── components/    # Framer Motion UI Components
    │   ├── App.jsx        
    │   └── main.jsx       
    └── vite.config.js     # PWA Configuration
```
