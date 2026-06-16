/**
 * Stitch AI UI interfaces
 */

export interface KpiMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  color: string;
  subtext: string;
}

export interface TradeAlert {
  id: string;
  route: string;
  severity: "high" | "medium" | "low";
  impactScore: number;
  affectedValue: string;
  delayFactor: string;
  delayEta: string;
  freightCostImpact: string;
  origin: string;
  destination: string;
  description: string;
}

export interface ForecastPoint {
  date: string;
  historicalValue?: number;
  forecastValue: number;
  yhat_lower: number;
  yhat_upper: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  name: string;
  dateGenerated: string;
  type: string;
  size: string;
  downloadTag: string;
}

export interface AppUser {
  email: string;
  name: string;
  organization?: string;
  role?: string;
}
