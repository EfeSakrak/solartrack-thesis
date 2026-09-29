import asyncio
import random
import time
import requests

# FastAPI Backend Endpoint
API_URL = "http://localhost:8000/api/telemetry/live"

async def generate_telemetry():
    """
    Simulates a 3.5 kW Solar Panel Array.
    Generates stochastic environmental noise to mimic cloud cover and shading.
    """
    base_voltage = 24.0
    base_current = 140.0
    
    print("Starting SolarTrack Stochastic Emulator...")
    print("Transmitting data to FastAPI Backend...")
    
    while True:
        # Introduce stochastic environmental noise
        voltage_noise = random.uniform(-1.5, 1.5)
        current_noise = random.uniform(-10.0, 15.0)
        
        current_voltage = round(base_voltage + voltage_noise, 2)
        current_amps = round(base_current + current_noise, 2)
        
        # Calculate total power (P = V * I)
        power_output = round(current_voltage * current_amps, 2)
        
        payload = {
            "timestamp": time.time(),
            "voltage": current_voltage,
            "current": current_amps,
            "power_output": power_output
        }
        
        try:
            response = requests.post(API_URL, json=payload)
            print(f"Data Transmitted: {payload} | Status: {response.status_code}")
        except Exception as e:
            print(f"Connection Error (Is the backend running?): {e}")
            
        # 3-second polling interval
        await asyncio.sleep(3)

if __name__ == "__main__":
    try:
        asyncio.run(generate_telemetry())
    except KeyboardInterrupt:
        print("\nEmulator stopped by user.")