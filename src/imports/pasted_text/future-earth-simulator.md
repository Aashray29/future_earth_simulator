Convert my Figma design into a full-stack working web application called **"Future Earth Simulator"**.

Figma Link:
https://www.figma.com/make/jurJ45O6Qpsin2a7Ou5EVi/Future-Earth-Simulator-App

---

🎯 GOAL:

Recreate the UI exactly as shown in Figma and connect it with a working backend simulation system.

---

🖥️ FRONTEND (STRICTLY MATCH FIGMA):

Use:

* React (Vite)
* Tailwind CSS

Instructions:

1. Carefully analyze the Figma design and replicate:

   * Layout
   * Colors
   * Fonts
   * Spacing
   * Components
   * Animations

2. Break UI into components:

   * Navbar
   * Map section
   * Policy control panel (sliders)
   * Simulation button
   * Results dashboard
   * Charts section

3. Maintain pixel-perfect design.

---

🗺️ MAP INTEGRATION:

Use Leaflet.js:

* Display world map
* Add markers for cities from database
* On marker click → select city
* Highlight selected city visually

---

🎛️ POLICY CONTROLS:

Create sliders for:

* EV adoption %
* Trees planted
* Renewable energy %
* Public transport %

Each slider should:

* Show live value
* Be styled according to Figma UI

---

⚙️ BACKEND (FASTAPI):

Create a FastAPI backend with endpoint:

POST /simulate

Input:
{
city,
ev_percent,
trees_planted,
renewable_percent,
public_transport_percent
}

Simulation logic:

co2_reduction =
(ev_percent * 0.4)

* (renewable_percent * 0.3)
* (public_transport_percent * 0.2)
* ((trees_planted / 1000000) * 0.1)

aqi_improvement = co2_reduction * 0.8
temperature_change = -(co2_reduction * 0.05)
sustainability_score = min(100, co2_reduction + aqi_improvement)

Return:
{
co2_reduction,
aqi_improvement,
temperature_change,
sustainability_score
}

---

🗄️ DATABASE (SUPABASE):

Connect FastAPI to Supabase.

Tables:

cities:

* id
* city_name
* latitude
* longitude
* population
* baseline_co2
* baseline_aqi

simulations:

* id
* city_id
* ev_percent
* trees_planted
* renewable_percent
* public_transport_percent
* co2_reduction
* sustainability_score
* created_at

Backend should:

1. Fetch city data
2. Store simulation results
3. Return response

---

🔗 FRONTEND ↔ BACKEND:

* Use fetch or axios
* Send data on "Run Simulation"
* Show loading animation
* Update dashboard dynamically

---

📊 DATA VISUALIZATION:

Use Chart.js:

* CO2 reduction chart
* AQI improvement chart
* Sustainability score indicator

Charts must match Figma style.

---

🌍 FUTURE MODE (2035):

Add toggle button:

* When enabled, show projected future results
* Add:

  * Temperature projection
  * Carbon neutrality indicator
  * Forest growth estimate

---

✨ UX FEATURES:

* Smooth transitions
* Hover effects
* Animated number counters
* Responsive design
* Dark futuristic theme

---

📦 OUTPUT:

Generate:

1. Complete React frontend code
2. Tailwind styling
3. FastAPI backend code
4. Supabase integration
5. API connection logic
6. Folder structure
7. Run instructions

---

⚠️ IMPORTANT:

* Follow Figma design strictly
* Code should be clean and modular
* Ensure everything works end-to-end
* Make it hackathon-level impressive
