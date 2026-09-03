# LandShield 🛡️

LandShield is a modern, high-class Land Verification & Cadastral Exploration SaaS platform for India (Karnataka), offering live parcel identification via KGIS Cadastral Layer 5 spatial queries and Bhoomi land records discovery.

---

## 🌟 Features

- **Luxury Landing Page:** High-end, rich design with emerald green and gold aesthetics, smooth scrollable experience, product features, and pricing plans.
- **Cadastral Explorer (`/demo`):**
  - Instant parcel identification on Karnataka map.
  - Interactive Leaflet map with multiple basemaps (Standard, Google Road, Satellite, Esri).
  - Search by landmark or address across Karnataka.
  - Live spatial polygon boundary rendering with Survey Number tags.
  - **Bhoomi Land Records:** Query owner & khatedar details, with direct action links to official Bhoomi portal and RTC upload fallback.
  - **GeoJSON Export:** One-click download of cadastral parcel geometry.
- **Authentication & Security:** Protected Demo route requiring login/signup with OAuth (Google/LinkedIn) and Quick Demo access.
- **Contact Us & Email Delivery:** Integrated contact modal backed by Nodemailer.

---

## 🏗️ Architecture

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router 7, Leaflet, Lucide React, Framer Motion.
- **Backend:** Node.js, Express, Nodemailer, Morgan, CORS, KGIS Cadastral Layer 5 & Bhoomi API Integrations.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
