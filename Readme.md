<h1 align="center">☀️ SolarTrack: Telemetry Monitoring System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white" alt="SQLite">
</p>

## 📌 Project Overview
**SolarTrack** is a comprehensive telemetry monitoring system developed as a bachelor's thesis project. It is designed to asynchronously fetch, process, and visualize real-time parameter data from solar power plants. The system provides a robust architecture to monitor energy efficiency and detect operational anomalies.

## 🏗️ System Architecture
The project follows a decoupled architecture, separating the client-side presentation from the server-side data processing:

*   **Backend (FastAPI):** Built with Python and FastAPI to handle asynchronous data streams and API requests efficiently. It ensures high performance when processing incoming telemetry data.
*   **Database (SQLite):** A lightweight and reliable relational database used to store historical telemetry data and system logs.
*   **Frontend (React.js):** A dynamic, single-page application (SPA) that consumes the RESTful API to render real-time dashboards and data visualizations.

## 🚀 Key Engineering Features
- **Asynchronous Processing:** Utilized Python's `asyncio` within FastAPI to handle multiple telemetry data points without blocking the main thread.
- **RESTful API Design:** Clean, scalable, and well-documented API endpoints for seamless frontend-backend communication.
- **Modern UI/UX:** Built a responsive dashboard using React.js and Vite to present complex data in an understandable format.

> **Note:** Dashboard screenshot will be added here.
> <img width="1920" height="1080" alt="thesis" src="https://github.com/user-attachments/assets/50916f92-af12-4458-924d-fdc67733abe9" />


## ⚙️ Local Setup & Installation

To run this project on your local machine, follow the instructions below:

### Prerequisites
- Python 3.8+
- Node.js (v14+)
- npm or yarn

### 1. Backend Setup (FastAPI)
```bash
# Clone the repository
git clone [https://github.com/EfeSakrak/solartrack-thesis.git](https://github.com/EfeSakrak/solartrack-thesis.git)
cd solartrack-thesis/backend

# Create and activate a virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
