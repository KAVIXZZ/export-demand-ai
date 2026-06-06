from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from datetime import datetime
from database import Base

class ExportData(Base):
    """Export data uploaded by users"""
    __tablename__ = "export_data"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), unique=True, index=True)
    date = Column(String(50))
    region = Column(String(100))
    product = Column(String(100))
    quantity = Column(Integer)
    price = Column(Float)
    demand_forecast = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Forecast(Base):
    """AI-generated forecasts"""
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(50), index=True)
    actual_value = Column(Float, nullable=True)
    predicted_value = Column(Float)
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class RiskAnalysis(Base):
    """Supply chain risk scores"""
    __tablename__ = "risk_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String(100), index=True)
    risk_score = Column(Float)  # 0-100
    risk_level = Column(String(50))  # Low, Medium, High
    demand_volatility = Column(Float)
    export_drop_percent = Column(Float)
    supply_chain_risk = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class Recommendation(Base):
    """AI-generated recommendations"""
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    category = Column(String(100))  # Growth, Risk Mitigation, etc.
    impact = Column(String(50))  # High, Medium, Low
    confidence = Column(Float)  # 0-100
    details = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())

class DashboardStats(Base):
    """Dashboard statistics"""
    __tablename__ = "dashboard_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    total_exports = Column(Float)
    forecast_demand = Column(Float)
    risk_level = Column(String(50))
    ai_confidence = Column(Float)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
