# 🌱 FoodBridge

FoodBridge is an AI-powered demand prediction and redistribution platform designed to bridge the gap between surplus food and the communities that need it. By optimizing kitchen preparation schedules and facilitating volunteer-driven redistribution, FoodBridge reduces food waste, cuts carbon emissions, and ensures nutritious food reaches local NGOs efficiently.

---

## 🚀 Key Features

- **🧠 Smart Demand Prediction**: Utilizes historical consumption data, day-specific patterns, and expected attendance to recommend precise meal quantities with a built-in safety buffer.
- **🍱 Donation Lifecycle Management**: Seamlessly declare surplus food donations, track status updates (`Available` ➔ `Claimed` ➔ `Collected`), and prevent over-donation based on calculated database surpluses.
- **🤝 Volunteer Coordination**: Manage volunteer availability, assign active roles, and monitor engagement metrics.
- **🏢 NGO & Admin Portals**: Dedicated workspaces for admins (to log meal history and oversee volunteers) and NGOs (to claim available food donations).
- **📊 Analytics Dashboard**: Live metrics detailing total meals donated, claimed meals, volunteer statuses, and prediction confidence metrics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (Tailwind-free premium UI layout, glassmorphism, responsive viewports)
- **Build Tool**: Vite 8

### Backend
- **Framework**: Flask (Python) with Flask-CORS
- **Database**: SQLite3 (`foodbridge.db`)
- **State Management**: SQL queries for transaction validation (e.g., ensuring donations do not exceed actual surplus).

---

## 📐 Architecture Overview

```
                      +-------------------+
                      |   React Frontend  |
                      |  (Vite Dev Server)|
                      +---------+---------+
                                |
                                | (HTTP/JSON API Requests)
                                v
                      +---------+---------+
                      |   Flask Backend   |
                      |    (Port 5000)    |
                      +---------+---------+
                                |
                                | (SQL Queries)
                                v
                      +---------+---------+
                      |  SQLite Database  |
                      |  (foodbridge.db)  |
                      +-------------------+
```

---

## ⚙️ Setup & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.8+)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install Flask flask-cors
   ```
4. Start the server:
   ```bash
   python app.py
   ```
   *Note: The SQLite database `foodbridge.db` will automatically initialize on startup with sample schema.*

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the local address provided in the terminal (usually `http://localhost:5173`).

---

## 🧠 Prediction Logic

The platform calculates predictions using a hybrid formula based on:
1. **Historical Baseline**: A day-of-week average calculated across all previous database records.
2. **Attendance Fine-tuning**: When expected attendance is inputted, the algorithm adjusts the prediction:
   $$\text{Adjustment} = (\text{Historical Average} - \text{Expected Attendance}) \times 10\%$$
   $$\text{Predicted Demand} = \text{Expected Attendance} + \text{Adjustment}$$
3. **Safety Boundaries**: The predicted demand is capped between $90\%$ and $110\%$ of expected attendance.
4. **Safety Buffer**: A final $+5\%$ buffer is applied to produce the final recommended meals output.

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/` | Checks API status |
| **GET** | `/api/meals/history` | Retrieves all recorded meal history |
| **POST** | `/api/meals/history` | Logs new meal statistics (prepared vs. consumed) |
| **POST** | `/api/prediction` | Generates demand prediction based on day & attendance |
| **GET** | `/api/meals/prediction/<day>`| Retrieves simple average prediction for a specific day |
| **GET** | `/api/meals/history/summary` | Retrieves weekly averages grouped by day |
| **GET** | `/api/donations` | Lists all donations |
| **POST** | `/api/donations` | Posts a new donation (validates against remaining surplus) |
| **PUT** | `/api/donations/<id>/status` | Updates donation status |
| **GET** | `/api/donations/summary` | Aggregated donation data (meals, claimed, total) |
| **GET** | `/api/volunteers` | Lists all registered volunteers |
| **POST** | `/api/volunteers` | Adds a new volunteer |
| **PUT** | `/api/volunteers/<id>/availability` | Updates a volunteer's availability status |
| **PUT** | `/api/volunteers/<id>/status` | Activates/Deactivates a volunteer |
| **GET** | `/api/volunteers/summary` | Get count of active, busy, and unavailable volunteers |

---

## 📁 Repository Structure

```
FoodBridge/
├── backend/
│   ├── app.py             # Flask application & database logic
│   ├── foodbridge.db      # SQLite database file
│   └── venv/              # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard panels & UI Pages
│   │   ├── App.jsx        # Routing and entrypoint
│   │   ├── main.jsx       # React DOM rendering
│   │   └── App.css        # Core design system stylesheet
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md              # Main documentation
```
