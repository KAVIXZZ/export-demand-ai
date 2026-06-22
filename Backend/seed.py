import datetime
import sys
import os
import importlib.util

# Resolve absolute path of backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Force-load local models.py to prevent conflicts with global 'models' packages
models_file_path = os.path.join(backend_dir, "models.py")
if os.path.exists(models_file_path):
    try:
        spec = importlib.util.spec_from_file_location("models", models_file_path)
        models = importlib.util.module_from_spec(spec)
        sys.modules["models"] = models
        spec.loader.exec_module(models)
        print(f"📦 Successfully loaded local models from: {models_file_path}")
    except Exception as e:
        print(f"❌ Failed to force-load local models.py: {str(e)}")
        import models
else:
    import models

from database import SessionLocal, engine, Base

# Initialize the database session
db = SessionLocal()

def seed_database():
    print("⏳ Starting database seeding process...")
    
    # Pre-flight check: Verify models are correctly loaded from the schema
    required_models = ["ExportData", "Forecast", "RiskAlert", "Recommendation"]
    missing = False
    for model_name in required_models:
        if not hasattr(models, model_name):
            print(f"❌ Critical Error: Class '{model_name}' is missing from models.py!")
            missing = True
            
    if missing:
        # Diagnostic print to help the user see what is actually inside their models.py
        available_attrs = [attr for attr in dir(models) if not attr.startswith("_")]
        print(f"🔍 Diagnostic: Available classes/attributes found in your models.py: {available_attrs}")
        print(f"💡 Imported models path: {getattr(models, '__file__', 'Unknown')}")
        print("💡 Please ensure 'backend/models.py' contains all table classes and has been saved (Ctrl + S).")
        return

    # Ensure all tables exist in the database before inserting data
    Base.metadata.create_all(bind=engine)
    
    # 1. Seed ExportData Table (Historical trade records)
    if db.query(models.ExportData).count() == 0:
        print("📥 Seeding ExportData...")
        exports = [
            models.ExportData(date=datetime.datetime(2026, 1, 15), product_cat="Apparel", destination="USA", value_usd=4200.0, volume_units=12000),
            models.ExportData(date=datetime.datetime(2026, 2, 15), product_cat="Ceylon Tea", destination="UK", value_usd=4500.0, volume_units=8500),
            models.ExportData(date=datetime.datetime(2026, 3, 15), product_cat="Rubber", destination="Germany", value_usd=4800.0, volume_units=6000),
            models.ExportData(date=datetime.datetime(2026, 4, 15), product_cat="Apparel", destination="USA", value_usd=5100.0, volume_units=14500),
            models.ExportData(date=datetime.datetime(2026, 5, 15), product_cat="Ceylon Tea", destination="Japan", value_usd=4900.0, volume_units=9000),
            models.ExportData(date=datetime.datetime(2026, 6, 15), product_cat="Spices", destination="India", value_usd=5300.0, volume_units=11000),
        ]
        db.add_all(exports)
        db.commit()
        print("✅ ExportData table seeded successfully!")
    else:
        print("ℹ️ ExportData table already has data. Skipping...")
    
    # 2. Seed Forecasts Table (Prophet model seasonal projections)
    if db.query(models.Forecast).count() == 0:
        print("📈 Seeding Forecasts...")
        forecasts = [
            models.Forecast(product_cat="Apparel", forecast_date=datetime.datetime(2026, 7, 1), yhat=5720.0, yhat_lower=5400.0, yhat_upper=5950.0),
            models.Forecast(product_cat="Ceylon Tea", forecast_date=datetime.datetime(2026, 8, 1), yhat=6150.0, yhat_lower=5800.0, yhat_upper=6420.0),
            models.Forecast(product_cat="Rubber", forecast_date=datetime.datetime(2026, 9, 1), yhat=6400.0, yhat_lower=6100.0, yhat_upper=6700.0),
        ]
        db.add_all(forecasts)
        db.commit()
        print("✅ Forecasts table seeded successfully!")
    else:
        print("ℹ️ Forecasts table already has data. Skipping...")

    # 3. Seed RiskAlerts Table (Route risk evaluations)
    if db.query(models.RiskAlert).count() == 0:
        print("🚨 Seeding RiskAlerts...")
        risks = [
            models.RiskAlert(route="Colombo to Rotterdam (Suez Canal)", risk_factor="Geopolitical Tension", risk_level="High", delay_days=10, cost_impact_pct=15.0),
            models.RiskAlert(route="Colombo to New York (Cape Route)", risk_factor="Port Congestion", risk_level="Medium", delay_days=5, cost_impact_pct=8.0),
            models.RiskAlert(route="Colombo to Hamburg (North Sea)", risk_factor="Weather Disruption", risk_level="High", delay_days=8, cost_impact_pct=12.0),
            models.RiskAlert(route="Colombo to Tokyo (East Asia)", risk_factor="Local Customs Delay", risk_level="Low", delay_days=2, cost_impact_pct=2.0),
        ]
        db.add_all(risks)
        db.commit()
        print("✅ RiskAlerts table seeded successfully!")
    else:
        print("ℹ️ RiskAlerts table already has data. Skipping...")

    # 4. Seed Recommendations Table (AI advisory mitigations)
    if db.query(models.Recommendation).count() == 0:
        print("💡 Seeding Recommendations...")
        recommendations = [
            models.Recommendation(category="Apparel", title="Divert US Shipments", description="Divert 15% of European-bound apparel cargo through Hambantota Port to avoid Suez congestion.", priority="High"),
            models.Recommendation(category="Ceylon Tea", title="Pre-buffer Rotterdam Stock", description="Increase tea warehouse safety buffer in Rotterdam by 14 days ahead of peak winter demand.", priority="Medium"),
        ]
        db.add_all(recommendations)
        db.commit()
        print("✅ Recommendations table seeded successfully!")
    else:
        print("ℹ️ Recommendations table already has data. Skipping...")

    print("🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print("❌ Seeding failed with error:", str(e))
    finally:
        db.close()