import React, { useState, useEffect } from 'react';
import { Country, State, City as CSCCity } from 'country-state-city';
import { Globe, MapPin, Search } from 'lucide-react';
import { City } from '../types';

interface CitySelectorProps {
  onCitySelected: (city: City) => void;
}

export function CitySelector({ onCitySelected }: CitySelectorProps) {
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // When country changes, load states
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setCities([]);
      setSelectedState('');
      setSelectedCity('');
      
      // If a country has no states, try to fetch cities directly (some small countries don't have states)
      if (stateList.length === 0) {
          const directCities = CSCCity.getCitiesOfCountry(selectedCountry) || [];
          setCities(directCities);
      }
    }
  }, [selectedCountry]);

  // When state changes, load cities
  useEffect(() => {
    if (selectedState && selectedCountry) {
      const cityList = CSCCity.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityList);
      setSelectedCity('');
    }
  }, [selectedState, selectedCountry]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    if (!cityName) return;

    // Find the specific city object to get lat/lng
    const cityData = cities.find(c => c.name === cityName);
    if (!cityData) return;

    const lat = Number(cityData.latitude);
    const lng = Number(cityData.longitude);

    // Generate a deterministically random population/co2 baseline for simulation context
    // In a real app, you would fetch real environmental data from an API using the lat/lng.
    const pseudoPop = Math.floor(Math.abs(Math.sin(lat * lng)) * 5000000) + 50000;
    const pseudoCo2 = Math.floor(Math.abs(Math.cos(lat)) * 50) + 20;
    const pseudoAqi = Math.floor(Math.abs(Math.cos(lng)) * 60) + 30;

    const newCity: City = {
      id: `${selectedCountry}-${selectedState}-${cityName}`.replace(/\s+/g, '-').toLowerCase(),
      name: cityName,
      lat,
      lng,
      population: pseudoPop,
      baseline_co2: pseudoCo2,
      baseline_aqi: pseudoAqi,
      country: selectedCountry,
      state: selectedState
    };

    onCitySelected(newCity);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 w-full">
        <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5" /> Country
        </label>
        <select 
          className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors appearance-none"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Select a Country</option>
          {countries.map(c => (
            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full">
        <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> State / Region
        </label>
        <select 
          className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry || states.length === 0}
        >
          <option value="">{states.length === 0 && selectedCountry ? "No States" : "Select a State"}</option>
          {states.map(s => (
            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full">
        <label className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
          <Search className="w-3.5 h-3.5" /> City
        </label>
        <select 
          className="w-full bg-slate-950 border border-emerald-500/50 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          value={selectedCity}
          onChange={(e) => handleCitySelect(e.target.value)}
          disabled={cities.length === 0}
        >
          <option value="">{cities.length === 0 && (selectedState || selectedCountry) ? "No Cities Found" : "Select a City"}</option>
          {cities.map((c, i) => (
            <option key={`${c.name}-${i}`} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
