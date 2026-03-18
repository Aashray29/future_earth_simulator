import { City, Policies } from "./types";

export const CITIES: City[] = [
  { 
    id: "nyc", 
    name: "New York City", 
    lat: 40.7128, lng: -74.0060, 
    population: 8400000, 
    baseline_co2: 50, baseline_aqi: 60,
  },
  { 
    id: "ldn", 
    name: "London", 
    lat: 51.5074, lng: -0.1278, 
    population: 8980000, 
    baseline_co2: 40, baseline_aqi: 50,
  },
  { 
    id: "tok", 
    name: "Tokyo", 
    lat: 35.6762, lng: 139.6503, 
    population: 13929286, 
    baseline_co2: 60, baseline_aqi: 70,
  },
  { 
    id: "syd", 
    name: "Sydney", 
    lat: -33.8688, lng: 151.2093, 
    population: 5312000, 
    baseline_co2: 30, baseline_aqi: 35,
  },
  { 
    id: "sp", 
    name: "São Paulo", 
    lat: -23.5505, lng: -46.6333, 
    population: 12325000, 
    baseline_co2: 45, baseline_aqi: 65,
  },
];

export const DEFAULT_POLICIES: Policies = {
  ev: 20, // percentage
  trees: 1000000, // actual count
  renewable: 15, // percentage
  publicTransport: 30, // percentage
};
