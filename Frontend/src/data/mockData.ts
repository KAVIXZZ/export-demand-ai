import { KpiMetric, TradeAlert, ForecastPoint, ReportItem } from "../types";

export const KPI_METRICS: KpiMetric[] = [
  {
    id: "total_export",
    name: "Total Export Value",
    value: "$29.8M",
    change: "+12% vs last Q",
    trend: "up",
    color: "indigo-500",
    subtext: "Aggregate trade value tracked"
  },
  {
    id: "accuracy",
    name: "Prophet AI Accuracy",
    value: "94.2%",
    change: "+0.4% baseline optimization",
    trend: "up",
    color: "emerald-400",
    subtext: "Mean absolute percentage error"
  },
  {
    id: "risk_routes",
    name: "High-Risk Lanes",
    value: "2 Routes",
    change: "Active Suez Canal blockage",
    trend: "down",
    color: "rose-500",
    subtext: "Redirected routing advised"
  },
  {
    id: "db_status",
    name: "Database Sync",
    value: "PostgreSQL Live",
    change: "Sync status: OK",
    trend: "stable",
    color: "sky-400",
    subtext: "Stitch analytics engine database"
  }
];

export const RECENT_ALERTS: TradeAlert[] = [
  {
    id: "alert-1",
    route: "Red Sea (Suez Canal) Route Bypass",
    severity: "high",
    impactScore: 94,
    affectedValue: "$12.4M",
    delayFactor: "Suez Canal Bottleneck & Geopolitical Strains",
    delayEta: "12-15 Days",
    freightCostImpact: "+45% spot rate increase",
    origin: "Colombo Port (LK)",
    destination: "Port of Hamburg (DE)",
    description: "Maritime carrier delays extend standard shipping lanes. Advising strategic rerouting via the Cape of Good Hope to avoid active disruptions."
  },
  {
    id: "alert-2",
    route: "East Coast Panama Canal Draught Restrictions",
    severity: "medium",
    impactScore: 71,
    affectedValue: "$6.8M",
    delayFactor: "Draught Restrictions due to Low Water levels",
    delayEta: "6-8 Days",
    freightCostImpact: "+20% spot rate premium",
    origin: "Port of Colombo (Ceylon Tea)",
    destination: "Port of New York (US)",
    description: "Extended wait times for neo-panamax vessels. Alternate rail corridors via West Coast are currently executing with high volume."
  }
];

export const TRADE_ROUTES: TradeAlert[] = [
  ...RECENT_ALERTS,
  {
    id: "alert-3",
    route: "Malacca Strait Congestion",
    severity: "low",
    impactScore: 35,
    affectedValue: "$4.1M",
    delayFactor: "High Vessel Density & Port Backlog",
    delayEta: "2-4 Days",
    freightCostImpact: "Minimal (+5%)",
    origin: "Port of Belawan (ID)",
    destination: "Port of Shanghai (CN)",
    description: "Minor transit bunching at Changi anchorage. Standard logistics lines remain highly viable."
  }
];

export const HISTORICAL_FORECAST_DATA: { [key: string]: ForecastPoint[] } = {
  "Ceylon Tea": [
    { date: "Jan", historicalValue: 1.2, forecastValue: 1.25, yhat_lower: 1.15, yhat_upper: 1.35 },
    { date: "Feb", historicalValue: 1.4, forecastValue: 1.38, yhat_lower: 1.28, yhat_upper: 1.48 },
    { date: "Mar", historicalValue: 1.5, forecastValue: 1.52, yhat_lower: 1.40, yhat_upper: 1.64 },
    { date: "Apr", historicalValue: 1.7, forecastValue: 1.68, yhat_lower: 1.55, yhat_upper: 1.81 },
    { date: "May", historicalValue: 1.6, forecastValue: 1.65, yhat_lower: 1.50, yhat_upper: 1.80 },
    { date: "Jun", historicalValue: 1.9, forecastValue: 1.88, yhat_lower: 1.72, yhat_upper: 2.04 },
    { date: "Jul", historicalValue: undefined, forecastValue: 2.10, yhat_lower: 1.91, yhat_upper: 2.29 },
    { date: "Aug", historicalValue: undefined, forecastValue: 2.25, yhat_lower: 2.05, yhat_upper: 2.45 },
    { date: "Sep", historicalValue: undefined, forecastValue: 2.30, yhat_lower: 2.08, yhat_upper: 2.52 },
    { date: "Oct", historicalValue: undefined, forecastValue: 2.42, yhat_lower: 2.15, yhat_upper: 2.69 },
    { date: "Nov", historicalValue: undefined, forecastValue: 2.38, yhat_lower: 2.10, yhat_upper: 2.66 },
    { date: "Dec", historicalValue: undefined, forecastValue: 2.55, yhat_lower: 2.25, yhat_upper: 2.85 }
  ],
  "Apparel": [
    { date: "Jan", historicalValue: 4.1, forecastValue: 4.20, yhat_lower: 3.90, yhat_upper: 4.50 },
    { date: "Feb", historicalValue: 4.3, forecastValue: 4.32, yhat_lower: 4.02, yhat_upper: 4.62 },
    { date: "Mar", historicalValue: 4.6, forecastValue: 4.55, yhat_lower: 4.25, yhat_upper: 4.85 },
    { date: "Apr", historicalValue: 4.8, forecastValue: 4.78, yhat_lower: 4.48, yhat_upper: 5.08 },
    { date: "May", historicalValue: 4.5, forecastValue: 4.60, yhat_lower: 4.30, yhat_upper: 4.90 },
    { date: "Jun", historicalValue: 5.1, forecastValue: 5.02, yhat_lower: 4.72, yhat_upper: 5.32 },
    { date: "Jul", historicalValue: undefined, forecastValue: 5.35, yhat_lower: 4.95, yhat_upper: 5.75 },
    { date: "Aug", historicalValue: undefined, forecastValue: 5.50, yhat_lower: 5.10, yhat_upper: 5.90 },
    { date: "Sep", historicalValue: undefined, forecastValue: 5.72, yhat_lower: 5.30, yhat_upper: 6.14 },
    { date: "Oct", historicalValue: undefined, forecastValue: 5.90, yhat_lower: 5.48, yhat_upper: 6.32 },
    { date: "Nov", historicalValue: undefined, forecastValue: 6.12, yhat_lower: 5.65, yhat_upper: 6.59 },
    { date: "Dec", historicalValue: undefined, forecastValue: 6.35, yhat_lower: 5.85, yhat_upper: 6.85 }
  ],
  "Rubber": [
    { date: "Jan", historicalValue: 0.85, forecastValue: 0.88, yhat_lower: 0.80, yhat_upper: 0.96 },
    { date: "Feb", historicalValue: 0.90, forecastValue: 0.89, yhat_lower: 0.81, yhat_upper: 0.97 },
    { date: "Mar", historicalValue: 0.95, forecastValue: 0.96, yhat_lower: 0.88, yhat_upper: 1.04 },
    { date: "Apr", historicalValue: 1.05, forecastValue: 1.02, yhat_lower: 0.94, yhat_upper: 1.10 },
    { date: "May", historicalValue: 1.00, forecastValue: 0.98, yhat_lower: 0.90, yhat_upper: 1.06 },
    { date: "Jun", historicalValue: 1.12, forecastValue: 1.10, yhat_lower: 1.02, yhat_upper: 1.18 },
    { date: "Jul", historicalValue: undefined, forecastValue: 1.15, yhat_lower: 1.05, yhat_upper: 1.25 },
    { date: "Aug", historicalValue: undefined, forecastValue: 1.20, yhat_lower: 1.10, yhat_upper: 1.30 },
    { date: "Sep", historicalValue: undefined, forecastValue: 1.22, yhat_lower: 1.11, yhat_upper: 1.33 },
    { date: "Oct", historicalValue: undefined, forecastValue: 1.28, yhat_lower: 1.16, yhat_upper: 1.40 },
    { date: "Nov", historicalValue: undefined, forecastValue: 1.25, yhat_lower: 1.13, yhat_upper: 1.37 },
    { date: "Dec", historicalValue: undefined, forecastValue: 1.32, yhat_lower: 1.19, yhat_upper: 1.45 }
  ]
};

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: "rep-1",
    name: "Suez Canal Delays & Cape Rerouting Impact Briefing.pdf",
    dateGenerated: "2026-06-12",
    type: "AI Insight Briefing",
    size: "2.4 MB",
    downloadTag: "SUEZ_CAPE_ADVISORY"
  },
  {
    id: "rep-2",
    name: "Ceylon Tea Q3 Demand Forecast Analysis.pdf",
    dateGenerated: "2026-06-10",
    type: "Demand Forecast PDF",
    size: "1.8 MB",
    downloadTag: "CEYLON_TEA_Q3"
  },
  {
    id: "rep-3",
    name: "Apparel Export Supply Chain Risk Mapping.pdf",
    dateGenerated: "2026-06-08",
    type: "Risk Classification Report",
    size: "3.1 MB",
    downloadTag: "APPAREL_RISK_MAP"
  },
  {
    id: "rep-4",
    name: "Global Rubber Sourcing Opportunities Study.pdf",
    dateGenerated: "2026-06-01",
    type: "Market Assessment Study",
    size: "4.5 MB",
    downloadTag: "RUBBER_ASSESSMENT"
  }
];

export const SMART_ANSWERS: { [key: string]: string } = {
  custom: "Stitch AI models indicate that Ceylon Tea and apparel pipelines remain heavily dependent on Red Sea maritime reliability. For instant mitigation, we suggest booking air freight options for high-value apparel collections, and shifting bulk Ceylon Tea consignments to Cape of Good Hope routes or land bridges with intermodal transfers to save up to 10 days of shipping lag.",
  red_sea: "ACTUAL MITIGATION RECOMMENDATION: To mitigate the Red Sea / Suez Canal disruption, Stitch AI recommends redirecting the active Ceylon Tea and Apparel shipments from Colombo Port through the Cape of Good Hope corridor. This increases raw travel distance but avoids the congested Suez Canal queues and current security surcharges, reducing predictable delays by 6-9 days while stabilizing freight rates at roughly $4,200/TEU.",
  apparel: "USA APPAREL ANALYSIS: Our Prophet AI forecasting path predicts a strong +14% year-over-year surge in US winter inventory replenishment starting early Q3. Key hubs like Chicago and Los Angeles will experience massive intake volumes. To safeguard apparel delivery, we recommend pre-booking container slot allotments with a 6-week horizon and deploying local air-dry freight alternatives for top tier apparel shipments.",
  rubber: "Rubber production across southeast Asian lanes shows stable demand horizons. However, volatile weather spikes at primary ports imply potential loading bottlenecks in August. Advised action is to establish short-term buffer stocks (+15%) in primary transition yards."
};
