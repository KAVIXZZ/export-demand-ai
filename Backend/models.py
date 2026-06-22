from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class ExportData(Base):
    __tablename__ = "exports_data"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    product_cat = Column(String, index=True, nullable=False)
    destination = Column(String, index=True, nullable=False)
    value_usd = Column(Float, nullable=False)
    volume_units = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_cat = Column(String, index=True, nullable=False)
    forecast_date = Column(DateTime, nullable=False)
    yhat = Column(Float, nullable=False)
    yhat_lower = Column(Float, nullable=False)
    yhat_upper = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RiskAlert(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    route = Column(String, index=True, nullable=False)
    risk_factor = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    delay_days = Column(Integer, nullable=True)
    cost_impact_pct = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())