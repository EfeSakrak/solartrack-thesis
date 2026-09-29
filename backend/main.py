import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta
from fastapi.responses import Response
import io
import csv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import random

# Import our new database configuration and models
import models
from database import engine, SessionLocal

# Create the database tables automatically when the app starts
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SolarTrack API", 
    description="Solar Power Plant Monitoring System Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Global variable for realistic simulation
current_simulated_power = 3.5

def get_realistic_sensor_data():
    global current_simulated_power
    fluctuation = random.uniform(-0.15, 0.15)
    current_simulated_power += fluctuation
    current_simulated_power = max(1.5, min(4.5, current_simulated_power))
    return round(current_simulated_power, 2)


@app.get("/")
def read_root():
    return {"message": "SolarTrack API is running successfully!"}


@app.get("/api/v1/power/current")
def get_current_power(db: Session = Depends(get_db)):
    power = get_realistic_sensor_data()
    
    # NEW: Save to Database
    db_power_log = models.PowerLog(total_power_kw=power)
    db.add(db_power_log)
    db.commit()
    
    return {
        "status": "success",
        "data": {
            "current_power_kw": power,
            "unit": "kW",
            "message": "System active",
            "timestamp": datetime.now().isoformat()
        }
    }


@app.get("/api/v1/panels")
def get_panel_data(db: Session = Depends(get_db)):
    global current_simulated_power
    base_power_per_panel = (current_simulated_power * 1000) / 6
    
    panels = []
    for i in range(1, 7):
        noise = random.uniform(0.95, 1.05)
        panel_power = round(base_power_per_panel * noise)
        voltage = round(random.uniform(30.0, 36.0), 1)
        current = round(panel_power / voltage, 2)
        
        status = "active"
        if panel_power < 100: 
            status = "warning"
            
        panel_data = {
            "id": f"P-{i:02d}",
            "status": status,
            "power_w": panel_power,
            "voltage_v": voltage,
            "current_a": current
        }
        panels.append(panel_data)
        
        # NEW: Save each panel's data to Database
        db_panel_log = models.PanelLog(
            panel_id=panel_data["id"],
            status=panel_data["status"],
            power_w=panel_data["power_w"],
            voltage_v=panel_data["voltage_v"],
            current_a=panel_data["current_a"]
        )
        db.add(db_panel_log)
        
    # Commit all 6 panel logs to the database at once
    db.commit()
        
    return {
        "status": "success",
        "data": panels
    }
from sqlalchemy import func

@app.get("/api/v1/stats/daily")
def get_daily_stats(db: Session = Depends(get_db)):
    # Get all power logs for today
    today = datetime.utcnow().date()
    logs = db.query(models.PowerLog).filter(
        func.date(models.PowerLog.timestamp) == today
    ).all()
    
    if not logs:
        return {"total_kwh": 0, "savings_try": 0, "co2_kg": 0}

    # Integration: Sum of (kW * time_interval_in_hours)
    # interval is 3 seconds = 3/3600 hours
    total_kwh = sum([log.total_power_kw for log in logs]) * (3 / 3600)
    
    # Simple calculations
    electricity_price_try = 2.95 # Average price per kWh in Turkey
    savings = total_kwh * electricity_price_try
    co2_saved = total_kwh * 0.45 # ~0.45 kg CO2 per kWh for grid average
    
    return {
        "status": "success",
        "data": {
            "total_kwh": round(total_kwh, 2),
            "savings_try": round(savings, 2),
            "co2_kg": round(co2_saved, 2),
            "record_count": len(logs)
        }
    }
@app.get("/api/v1/export/daily")
def export_daily_data(db: Session = Depends(get_db)):
    """
    Exports today's power logs as a downloadable CSV file.
    """
    today = datetime.utcnow().date()
    logs = db.query(models.PowerLog).filter(
        func.date(models.PowerLog.timestamp) == today
    ).all()

    # Create an in-memory string buffer for CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write the Header row
    writer.writerow(["Log ID", "Timestamp (UTC)", "Total Power (kW)"])

    # Write the data rows
    for log in logs:
        writer.writerow([log.id, log.timestamp.strftime("%Y-%m-%d %H:%M:%S"), log.total_power_kw])

    # Return as a downloadable CSV file
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=SolarTrack_Report_{today}.csv"
    return response
@app.get("/api/v1/power/forecast")
def get_power_forecast(db: Session = Depends(get_db)):
    """
    Uses Machine Learning (Linear Regression) to predict future power output
    based on recent historical data.
    """
    # Get the last 100 records from the database
    logs = db.query(models.PowerLog).order_by(models.PowerLog.timestamp.desc()).limit(100).all()
    logs.reverse() # Sort them in chronological order
    
    # We need at least a few records to train the model
    if len(logs) < 10:
        return {"status": "waiting", "message": "Gathering more data for AI..."}

    # Prepare data for Machine Learning
    # X = Time steps (0, 1, 2, ...), y = Power values (kW)
    X = np.array(range(len(logs))).reshape(-1, 1)
    y = np.array([log.total_power_kw for log in logs])

    # Initialize and Train the ML Model
    model = LinearRegression()
    model.fit(X, y)

    # Predict the next 15 future steps
    future_steps = 15
    X_future = np.array(range(len(logs), len(logs) + future_steps)).reshape(-1, 1)
    y_pred = model.predict(X_future)

    # Format the output for the React frontend
    predictions = []
    last_time = logs[-1].timestamp
    
    for i, pred_val in enumerate(y_pred):
        # Calculate future timestamps
        future_time = last_time + timedelta(seconds=3 * (i + 1))
        
        # Clamp values to be realistic (between 0 and Max Capacity 4.5)
        clamped_val = max(0.0, min(4.5, round(float(pred_val), 2)))
        
        predictions.append({
            "time": future_time.strftime("%H:%M:%S"),
            "predicted_kw": clamped_val
        })

    return {
        "status": "success",
        "data": predictions
    }

@app.get("/api/v1/history/{date_str}")
def get_history_data(date_str: str, db: Session = Depends(get_db)):
    """
    Fetches historical power data for a specific date (YYYY-MM-DD).
    Used for the Analytics Dashboard.
    """
    try:
        # Convert string to date object
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return {"status": "error", "message": "Invalid date format. Please use YYYY-MM-DD."}

    # Query logs specifically for that date
    logs = db.query(models.PowerLog).filter(
        func.date(models.PowerLog.timestamp) == target_date
    ).order_by(models.PowerLog.timestamp.asc()).all()

    if not logs:
        return {
            "status": "empty", 
            "message": "No data recorded for this date.",
            "data": [],
            "total_kwh": 0
        }

    # Calculate total energy for that specific day
    total_kwh = sum([log.total_power_kw for log in logs]) * (3 / 3600)

    return {
        "status": "success",
        "date": date_str,
        "total_kwh": round(total_kwh, 2),
        "data": [
            {
                "time": log.timestamp.strftime("%H:%M:%S"),
                "val": log.total_power_kw
            } for log in logs
        ]
    }

from fastapi import FastAPI