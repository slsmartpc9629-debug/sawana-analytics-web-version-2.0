# PulseMetrics — Modern Analytics Dashboard

A state-of-the-art, high-performance web analytics dashboard built with modern web standards, featuring ultra-sleek dark/light theme switching, glassmorphic UI components, animated KPI counters, dynamic ApexCharts visualizations, live table filtering, and CSV export.

---

## 🚀 Key Features

- **Executive KPI Cards**: Real-time counters with smooth count-up animations for Total Revenue, Active Users, Conversion Rate, and Average Session Duration, each paired with SVG sparkline trends.
- **ApexCharts Interactive Suite**:
  - **Revenue vs. Target Projection**: Smooth multi-series area chart with gradient fills and currency tooltips.
  - **Traffic Acquisition**: Donut chart with channel percentages.
  - **Peak Traffic Concurrency**: Column chart displaying user volume by hourly cycle.
  - **Client Platform Distribution**: Custom animated progress meters for Desktop, Mobile, and Tablet.
- **Dynamic Time Range Filter**: Switch instantly between `7 Days`, `30 Days`, `90 Days`, and `1 Year` with real-time recalculations.
- **Filterable Transactions Table**: Instant client-side search filtering by customer name, email, product, or transaction status.
- **Report Exporter**: Export filtered analytics data directly into a `.csv` file with instant toast confirmation.
- **Theme Switcher**: Instant toggle between Dark Mode and Light Mode with persistence via `localStorage`.
- **System Stream**: Real-time event log with status badges and relative timestamps.
- **Responsive Layout**: Designed to adapt seamlessly from 4K ultrawide displays to tablet and mobile screens.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags, accessible attributes, and responsive viewport configuration.
- **Vanilla CSS3**: Design system tokens via CSS Custom Properties, frosted glassmorphism (`backdrop-filter`), CSS Grid, and custom scrollbars.
- **Vanilla JavaScript (ES6+)**: Modular architecture (`data.js`, `charts.js`, `dashboard.js`) with zero build step required.
- **ApexCharts**: Modern SVG charting library loaded via CDN.
- **Lucide Icons**: Crisp vector iconography loaded via CDN.
- **Google Fonts**: `Plus Jakarta Sans` and `Outfit`.

---

## 💻 How to Run Locally

You can run this project directly by opening `index.html` in any modern browser, or by serving it using a local HTTP server:

### Option 1: Python HTTP Server
```powershell
python -m http.server 3000
```
Then navigate to: `http://localhost:3000`

### Option 2: Node.js `serve` / `npx`
```powershell
npx -y serve .
```

---

## 📁 File Structure

```
modern-analytics-dashboard/
├── index.html        # Main dashboard interface
├── css/
│   └── style.css     # Design system, themes & animations
├── js/
│   ├── data.js       # Mock datasets for metrics & transactions
│   ├── charts.js     # ApexCharts instances & render pipelines
│   └── dashboard.js  # State management, interactions & toasts
└── README.md         # Project documentation
```
