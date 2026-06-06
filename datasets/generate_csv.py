import csv
import random
from datetime import datetime, timedelta

# Regions and products
regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East']
products = ['Industrial Machinery', 'Electronics', 'Agricultural Produce', 'Chemicals', 'Textiles']

start_date = datetime.now() - timedelta(days=180)
data = []

for i in range(180):
    current_date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
    for region in regions:
        # Select a random product or multiple
        num_products = random.randint(1, 3)
        selected_products = random.sample(products, num_products)
        for product in selected_products:
            # Generate quantity with a trend and weekly seasonality
            base_qty = 100 + (i * 0.5)  # slight upward trend
            day_of_week = (start_date + timedelta(days=i)).weekday()
            seasonality = 20 if day_of_week < 5 else -30  # lower on weekends
            noise = random.randint(-15, 15)
            quantity = int(max(10, base_qty + seasonality + noise))
            
            # Price
            price_map = {
                'Industrial Machinery': 5000.0,
                'Electronics': 800.0,
                'Agricultural Produce': 150.0,
                'Chemicals': 1200.0,
                'Textiles': 350.0
            }
            price = round(price_map[product] * random.uniform(0.9, 1.1), 2)
            
            data.append({
                'date': current_date,
                'region': region,
                'product': product,
                'quantity': quantity,
                'price': price
            })

# Write to CSV
with open('d:/Final_Project/export-demand-ai/datasets/sample_export_data.csv', mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=['date', 'region', 'product', 'quantity', 'price'])
    writer.writeheader()
    writer.writerows(data)

print(f"Generated {len(data)} rows of sample export data.")
