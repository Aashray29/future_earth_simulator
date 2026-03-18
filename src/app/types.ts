export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  baseline_co2: number;
  baseline_aqi: number;
  left?: string;
  top?: string;
  country?: string;
  state?: string;
}

export interface Policies {
  ev: number;
  trees: number;
  renewable: number;
  publicTransport: number;
}

export interface SimulationResult {
  co2_reduction: number;
  aqi_improvement: number;
  temperature_change: number;
  sustainability_score: number;
}
