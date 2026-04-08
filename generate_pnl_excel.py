
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

# --- 1. Define Model Drivers & Assumptions ---

# Revenue Drivers
drivers = {
    "active_businesses_start": 50,
    "active_businesses_growth_mo": 1.25, # Accelerating growth
    "conversion_rate_pro": 0.15, # 15% of businesses subscribe to Pro
    "conversion_rate_elite": 0.05, # 5% of businesses subscribe to Elite
    "price_pro": 150000,
    "price_elite": 400000,
    "churn_rate": 0.05,
    "avg_coins_per_biz": 600, # Average coins purchased per business per month
    "coin_price_per_unit": 850, # Blended price per coin (bulk discount logic)
}

months = [f"Month {i}" for i in range(1, 13)]

# --- 2. Calculate Monthly Data ---

data = {
    "Month": months,
    "Active Businesses": [],
    "Subscribers (Pro)": [],
    "Subscribers (Elite)": [],
    "Revenue (Pro)": [],
    "Revenue (Elite)": [],
    "Coin Volume": [],
    "Revenue (Coins)": [],
    "Total Revenue": [],
    "COGS": [],
    "Gross Profit": [],
    "OpEx (Marketing)": [],
    "OpEx (Dev)": [],
    "OpEx (Admin)": [],
    "Total Expenses": [],
    "Net Profit": []
}

current_businesses = drivers["active_businesses_start"]
marketing_spend = [10.0, 10.0, 12.0, 12.0, 15.0, 15.0, 18.0, 18.0, 20.0, 20.0, 25.0, 25.0] # In Millions
dev_spend = [15.0, 15.0, 15.0, 18.0, 18.0, 18.0, 22.0, 22.0, 22.0, 25.0, 25.0, 25.0]
admin_spend = [2.0, 2.0, 2.0, 2.5, 2.5, 3.0, 3.0, 3.5, 3.5, 4.0, 4.0, 5.0]

for i in range(12):
    # Growth Logic
    growth_multiplier = 1.0 + (0.10 + (i * 0.015)) # Accelerating growth rate from 10% to ~28%
    current_businesses = int(current_businesses * growth_multiplier)
    
    # Subscriptions
    pro_subs = int(current_businesses * drivers["conversion_rate_pro"])
    elite_subs = int(current_businesses * drivers["conversion_rate_elite"])
    
    rev_pro = (pro_subs * drivers["price_pro"]) / 1_000_000 # In Millions
    rev_elite = (elite_subs * drivers["price_elite"]) / 1_000_000
    
    # Coins (Seasonality effect in months 11-12)
    seasonality = 1.5 if i >= 10 else 1.0
    total_coins = int(current_businesses * drivers["avg_coins_per_biz"] * seasonality)
    rev_coins = (total_coins * drivers["coin_price_per_unit"]) / 1_000_000
    
    total_rev = rev_pro + rev_elite + rev_coins
    
    # Costs
    cogs_hosting = 0.5 + (total_rev * 0.01)
    cogs_gateway = total_rev * 0.03
    cogs_sms = total_rev * 0.05
    total_cogs = cogs_hosting + cogs_gateway + cogs_sms
    
    gross_profit = total_rev - total_cogs
    
    # OpEx
    total_opex = marketing_spend[i] + dev_spend[i] + admin_spend[i]
    
    net_profit = gross_profit - total_opex
    
    # Append to data
    data["Active Businesses"].append(current_businesses)
    data["Subscribers (Pro)"].append(pro_subs)
    data["Subscribers (Elite)"].append(elite_subs)
    data["Revenue (Pro)"].append(round(rev_pro, 2))
    data["Revenue (Elite)"].append(round(rev_elite, 2))
    data["Coin Volume"].append(total_coins)
    data["Revenue (Coins)"].append(round(rev_coins, 2))
    data["Total Revenue"].append(round(total_rev, 2))
    data["COGS"].append(round(total_cogs, 2))
    data["Gross Profit"].append(round(gross_profit, 2))
    data["OpEx (Marketing)"].append(marketing_spend[i])
    data["OpEx (Dev)"].append(dev_spend[i])
    data["OpEx (Admin)"].append(admin_spend[i])
    data["Total Expenses"].append(round(total_opex, 2))
    data["Net Profit"].append(round(net_profit, 2))

# --- 3. Create DataFrame and Export ---

df = pd.DataFrame(data)
df.set_index("Month", inplace=True)

# Transpose for the classic P&L view (Months as columns)
df_display = df.T 

# Add Total Column
df_display["YEAR TOTAL"] = df_display.sum(axis=1)

# Fix Averages/Static data for totals logic (optional adjustments)
# Recalculate margins or averages if needed, but simple sum is fine for P&L lines.
# For Business counts, sum is meaningless, so we replace with Year End value
df_display.loc["Active Businesses", "YEAR TOTAL"] = df_display.loc["Active Businesses", "Month 12"]
df_display.loc["Subscribers (Pro)", "YEAR TOTAL"] = df_display.loc["Subscribers (Pro)", "Month 12"]
df_display.loc["Subscribers (Elite)", "YEAR TOTAL"] = df_display.loc["Subscribers (Elite)", "Month 12"]


output_file = "Financial_Projection.xlsx"

# Use ExcelWriter for multiple sheets and formatting
with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
    df_display.to_excel(writer, sheet_name='P&L Statement')
    
    # Assumptions Sheet
    assumptions_df = pd.DataFrame([
        {"Driver": "Starting Active Businesses", "Value": drivers["active_businesses_start"]},
        {"Driver": "Pro Subscription Price (UZS)", "Value": drivers["price_pro"]},
        {"Driver": "Elite Subscription Price (UZS)", "Value": drivers["price_elite"]},
        {"Driver": "Coin Price per Unit (Avg UZS)", "Value": drivers["coin_price_per_unit"]},
        {"Driver": "Avg Coins/Biz/Month", "Value": drivers["avg_coins_per_biz"]},
        {"Driver": "Conversion Rate (Pro)", "Value": f"{drivers['conversion_rate_pro']*100}%"},
        {"Driver": "Conversion Rate (Elite)", "Value": f"{drivers['conversion_rate_elite']*100}%"},
    ])
    assumptions_df.to_excel(writer, sheet_name='Assumptions', index=False)
    
    # Auto-adjust column widths (Basic)
    workbook = writer.book
    worksheet = writer.sheets['P&L Statement']
    
    # Formatting
    money_fmt = '#,##0.00'
    
    for row in worksheet.iter_rows(min_row=1, max_row=20, min_col=2, max_col=14):
        for cell in row:
            if isinstance(cell.value, (int, float)) and cell.row > 1: # Skip header
                 cell.number_format = money_fmt

print(f"Excel file generated: {output_file}")
