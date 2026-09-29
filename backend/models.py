from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class PowerLog(Base):
    __tablename__ = "power_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    total_power_kw = Column(Float)

class PanelLog(Base):
    __tablename__ = "panel_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    panel_id = Column(String, index=True)
    status = Column(String)
    power_w = Column(Float)
    voltage_v = Column(Float)
    current_a = Column(Float)