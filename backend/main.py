from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import delete
from sqlalchemy.orm import Session
import pandas as pd
import io
from typing import Dict, List

from database import get_db, init_db
from models import ExportData, Forecast, RiskAnalysis, Recommendation, DashboardStats
from schemas import (
    ExportDataResponse, ForecastResponse, RiskAnalysisResponse,
    RecommendationResponse, DashboardStatsResponse, FileUploadResponse
)
from ml_service import MLService

# Initialize FastAPI app
app = FastAPI(
    title="ExportIQ API",
    description="AI-Driven Export Demand Forecasting & Supply Chain Risk Intelligence",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3002", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
def startup():
    init_db()
    # Generate initial synthetic data
    generate_initial_data()

def generate_initial_data():
    """Generate initial data on startup"""
    db = next(get_db())
    
    try:
        # Check if data already exists
        if db.query(Forecast).count() > 0:
            return
        
        # Generate synthetic data
        synthetic_data = MLService.generate_synthetic_data(days=180)
        
        # Generate forecast
        forecast_result = MLService.forecast_demand(synthetic_data, periods=90)
        
        # Generate risk analysis
        risk_data = MLService.analyze_risk(synthetic_data)
        
        # Save forecasts
        for item in forecast_result.get('forecasts', []):
            forecast = Forecast(
                date=item['date'],
                actual_value=item.get('actual_value'),
                predicted_value=item['predicted_value'],
                confidence_lower=item['confidence_lower'],
                confidence_upper=item['confidence_upper']
            )
            db.add(forecast)
        
        # Save risk analysis
        for risk_item in risk_data:
            risk = RiskAnalysis(
                region=risk_item['region'],
                risk_score=risk_item['risk_score'],
                risk_level=risk_item['risk_level'],
                demand_volatility=risk_item['demand_volatility'],
                export_drop_percent=risk_item['export_drop_percent'],
                supply_chain_risk=risk_item['supply_chain_risk']
            )
            db.add(risk)
        
        # Generate and save recommendations
        recommendations = MLService.generate_recommendations(forecast_result, risk_data)
        for rec in recommendations:
            recommendation = Recommendation(
                title=rec['title'],
                description=rec['description'],
                category=rec['category'],
                impact=rec['impact'],
                confidence=rec['confidence'],
                details=rec['details']
            )
            db.add(recommendation)
        
        # Create dashboard stats
        avg_forecast = forecast_result['average_forecast']
        total_exports = synthetic_data['y'].sum()
        
        # Calculate overall risk
        avg_risk = sum(r['risk_score'] for r in risk_data) / len(risk_data)
        if avg_risk >= 60:
            risk_level = "High"
        elif avg_risk >= 35:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        dashboard = DashboardStats(
            total_exports=float(total_exports),
            forecast_demand=float(avg_forecast),
            risk_level=risk_level,
            ai_confidence=94.2
        )
        db.add(dashboard)
        
        db.commit()
        print("✅ Initial data generated successfully")
    except Exception as e:
        db.rollback()
        print(f"❌ Error generating initial data: {e}")
    finally:
        db.close()

# ============= API ENDPOINTS =============

@app.get("/")
def read_root():
    """API health check"""
    return {
        "name": "ExportIQ API",
        "version": "1.0.0",
        "status": "✅ Running",
        "description": "AI-Driven Export Demand Forecasting & Supply Chain Risk Intelligence"
    }

@app.get("/api/dashboard", response_model=DashboardStatsResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """Get dashboard summary statistics"""
    try:
        stats = db.query(DashboardStats).order_by(DashboardStats.last_updated.desc()).first()
        
        if not stats:
            # Calculate from forecast and risk data
            forecasts = db.query(Forecast).all()
            risk_data = db.query(RiskAnalysis).all()
            
            avg_forecast = sum(f.predicted_value for f in forecasts) / len(forecasts) if forecasts else 0
            avg_risk = sum(r.risk_score for r in risk_data) / len(risk_data) if risk_data else 0
            
            if avg_risk >= 60:
                risk_level = "High"
            elif avg_risk >= 35:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            stats = DashboardStats(
                total_exports=50000,
                forecast_demand=avg_forecast,
                risk_level=risk_level,
                ai_confidence=94.2
            )
            db.add(stats)
            db.commit()
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload", response_model=FileUploadResponse)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload CSV file with export data"""
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate columns
        required_columns = ['date', 'region', 'product', 'quantity', 'price']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Save to database
        row_count = 0
        for idx, row in df.iterrows():
            export_data = ExportData(
                filename=file.filename,
                date=str(row.get('date', '')),
                region=str(row.get('region', '')),
                product=str(row.get('product', '')),
                quantity=int(row.get('quantity', 0)),
                price=float(row.get('price', 0)),
                demand_forecast=float(row.get('demand_forecast', 0)) if 'demand_forecast' in df.columns else None
            )
            db.add(export_data)
            row_count += 1
        
        db.commit()

        # Regenerate ML models and dashboard stats with uploaded data
        if 'date' in df.columns and 'quantity' in df.columns:
            historical_data = df.rename(columns={'date': 'ds', 'quantity': 'y'})
            historical_data['ds'] = pd.to_datetime(historical_data['ds'], errors='coerce')
            historical_data = historical_data.dropna(subset=['ds', 'y'])

            if not historical_data.empty:
                db.execute(delete(Forecast))
                db.execute(delete(RiskAnalysis))
                db.execute(delete(Recommendation))
                db.execute(delete(DashboardStats))
                db.commit()

                forecast_result = MLService.forecast_demand(historical_data, periods=90)
                for item in forecast_result.get('forecasts', []):
                    forecast = Forecast(
                        date=item['date'],
                        actual_value=item.get('actual_value'),
                        predicted_value=item['predicted_value'],
                        confidence_lower=item['confidence_lower'],
                        confidence_upper=item['confidence_upper']
                    )
                    db.add(forecast)

                risk_data = MLService.analyze_risk(historical_data)
                for risk_item in risk_data:
                    risk = RiskAnalysis(
                        region=risk_item['region'],
                        risk_score=risk_item['risk_score'],
                        risk_level=risk_item['risk_level'],
                        demand_volatility=risk_item['demand_volatility'],
                        export_drop_percent=risk_item['export_drop_percent'],
                        supply_chain_risk=risk_item['supply_chain_risk']
                    )
                    db.add(risk)

                recommendations = MLService.generate_recommendations(forecast_result, risk_data)
                for rec in recommendations:
                    recommendation = Recommendation(
                        title=rec['title'],
                        description=rec['description'],
                        category=rec['category'],
                        impact=rec['impact'],
                        confidence=rec['confidence'],
                        details=rec['details']
                    )
                    db.add(recommendation)

                total_exports = float(historical_data['y'].sum())
                avg_forecast = forecast_result.get('average_forecast', 0)
                avg_risk = sum(r['risk_score'] for r in risk_data) / len(risk_data) if risk_data else 0
                if avg_risk >= 60:
                    risk_level = "High"
                elif avg_risk >= 35:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"

                dashboard = DashboardStats(
                    total_exports=total_exports,
                    forecast_demand=avg_forecast,
                    risk_level=risk_level,
                    ai_confidence=94.2
                )
                db.add(dashboard)
                db.commit()

        return FileUploadResponse(
            filename=file.filename,
            status="success",
            message=f"File uploaded and processed successfully",
            rows_processed=row_count
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/forecast", response_model=List[ForecastResponse])
def get_forecast(db: Session = Depends(get_db)):
    """Get demand forecast predictions"""
    try:
        forecasts = db.query(Forecast).all()
        
        if not forecasts:
            # Generate forecast if none exists
            forecast_result = MLService.forecast_demand(periods=90)
            
            for item in forecast_result.get('forecasts', []):
                forecast = Forecast(
                    date=item['date'],
                    actual_value=item.get('actual_value'),
                    predicted_value=item['predicted_value'],
                    confidence_lower=item['confidence_lower'],
                    confidence_upper=item['confidence_upper']
                )
                db.add(forecast)
            db.commit()
            forecasts = db.query(Forecast).all()
        
        return forecasts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/risk", response_model=List[RiskAnalysisResponse])
def get_risk(db: Session = Depends(get_db)):
    """Get supply chain risk analysis"""
    try:
        risk_data = db.query(RiskAnalysis).all()
        
        if not risk_data:
            # Generate risk analysis if none exists
            risk_result = MLService.analyze_risk()
            
            for risk_item in risk_result:
                risk = RiskAnalysis(
                    region=risk_item['region'],
                    risk_score=risk_item['risk_score'],
                    risk_level=risk_item['risk_level'],
                    demand_volatility=risk_item['demand_volatility'],
                    export_drop_percent=risk_item['export_drop_percent'],
                    supply_chain_risk=risk_item['supply_chain_risk']
                )
                db.add(risk)
            db.commit()
            risk_data = db.query(RiskAnalysis).all()
        
        return risk_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db)):
    """Get AI-generated recommendations"""
    try:
        recommendations = db.query(Recommendation).all()
        
        if not recommendations:
            # Generate recommendations if none exist
            forecast_data = {
                'status': 'success',
                'average_forecast': 80000
            }
            risk_data = MLService.analyze_risk()
            rec_result = MLService.generate_recommendations(forecast_data, risk_data)
            
            for rec in rec_result:
                recommendation = Recommendation(
                    title=rec['title'],
                    description=rec['description'],
                    category=rec['category'],
                    impact=rec['impact'],
                    confidence=rec['confidence'],
                    details=rec['details']
                )
                db.add(recommendation)
            db.commit()
            recommendations = db.query(Recommendation).all()
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports")
def get_reports(db: Session = Depends(get_db)):
    """Get all available reports"""
    try:
        reports = [
            {
                "id": 1,
                "name": "Q3 2026 Export Performance Report",
                "type": "Performance",
                "generated_date": "2026-06-05",
                "size": "2.4 MB",
                "format": "PDF",
                "status": "Ready"
            },
            {
                "id": 2,
                "name": "Demand Forecast - 6 Month Outlook",
                "type": "Forecast",
                "generated_date": "2026-06-04",
                "size": "1.8 MB",
                "format": "PDF",
                "status": "Ready"
            },
            {
                "id": 3,
                "name": "Supply Chain Risk Assessment",
                "type": "Risk Analysis",
                "generated_date": "2026-06-03",
                "size": "3.2 MB",
                "format": "PDF",
                "status": "Ready"
            }
        ]
        return reports
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/{report_id}/download")
def download_report(report_id: int):
    """Simulate report download in demo mode"""
    reports = [
        {
            "id": 1,
            "name": "Q3 2026 Export Performance Report",
            "type": "Performance",
            "generated_date": "2026-06-05",
            "size": "2.4 MB",
            "format": "PDF",
            "status": "Ready"
        },
        {
            "id": 2,
            "name": "Demand Forecast - 6 Month Outlook",
            "type": "Forecast",
            "generated_date": "2026-06-04",
            "size": "1.8 MB",
            "format": "PDF",
            "status": "Ready"
        },
        {
            "id": 3,
            "name": "Supply Chain Risk Assessment",
            "type": "Risk Analysis",
            "generated_date": "2026-06-03",
            "size": "3.2 MB",
            "format": "PDF",
            "status": "Ready"
        }
    ]
    report = next((item for item in reports if item["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return JSONResponse({"message": f"Report download for '{report['name']}' is available in demo mode."})

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": pd.Timestamp.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
