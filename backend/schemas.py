from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ExportDataBase(BaseModel):
    date: str
    region: str
    product: str
    quantity: int
    price: float
    demand_forecast: Optional[float] = None

class ExportDataCreate(ExportDataBase):
    pass

class ExportDataResponse(ExportDataBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ForecastBase(BaseModel):
    date: str
    predicted_value: float
    confidence_lower: float
    confidence_upper: float
    actual_value: Optional[float] = None

class ForecastResponse(ForecastBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RiskAnalysisBase(BaseModel):
    region: str
    risk_score: float
    risk_level: str
    demand_volatility: float
    export_drop_percent: float
    supply_chain_risk: float

class RiskAnalysisResponse(RiskAnalysisBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationBase(BaseModel):
    title: str
    description: str
    category: str
    impact: str
    confidence: float
    details: dict

class RecommendationResponse(RecommendationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    total_exports: float
    forecast_demand: float
    risk_level: str
    ai_confidence: float
    last_updated: datetime

    class Config:
        from_attributes = True

class FileUploadResponse(BaseModel):
    filename: str
    status: str
    message: str
    rows_processed: int
