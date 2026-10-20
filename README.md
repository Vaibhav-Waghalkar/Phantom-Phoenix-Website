# Phantom Phoenix Pest Control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express%20v4-lightgrey.svg)](https://expressjs.com/)
[![Responsive](https://img.shields.io/badge/Design-Fully%20Responsive-blue.svg)](#ui-previews)

> **"No More Pests. Just Peace!"**  
> A high-conversion, modern, responsive web application and booking platform built for **Phantom Phoenix Pest Control** — delivering safe, eco-friendly, and guaranteed pest eradication solutions for residential, commercial, industrial, and food service spaces.

---

## 📸 UI Previews

### 1. Hero & Header Section
Modern dark-themed hero with brand identity, 12 Months Warranty highlight, quick call and WhatsApp actions, and key selling propositions.

![Phantom Phoenix Pest Control - Hero Section](screenshots/01_hero_section.png)

---

### 2. Specialized Services & Pricing Plans
Categorized pest treatment cards (Cockroaches, Termites, Bedbugs, Rodents, Mosquitoes) with full treatment breakdown, transparent pricing, and instant "Book Service" triggers.

![Phantom Phoenix Pest Control - Services Section](screenshots/02_services_section.png)

---

### 3. Interactive Online Booking System
Form with dynamic property size picker, multiple pest type selectors, date restriction (today onwards), time slot scheduling, and direct WhatsApp sync.

![Phantom Phoenix Pest Control - Booking Section](screenshots/03_booking_section.png)

---

## 🌟 Key Features

- **🔥 High-Impact Modern Aesthetics**: Sleek dark-mode aesthetic with fire-and-ember gradients, glowing accents, glassmorphic cards, and fluid micro-animations.
- **⚡ Dual Booking Engine**:
  - **RESTful API Backend**: Node.js & Express server storing appointments with unique IDs in JSON data storage.
  - **Client-Side Fallback**: LocalStorage fallback keeps bookings safe even during offline or standalone static deployments.
- **📱 Instant WhatsApp & Phone Integration**: Deep links with pre-filled message templates allow customers to book directly via WhatsApp or click-to-call in one tap (`8459520633`).
- **🛡️ 12-Month Warranty Guarantee**: Visual badges reinforcing customer confidence across all treatment categories.
- **🎯 Interactive Service Selector**: Clicking "Book This Service" on any treatment card automatically pre-selects the category and scrolls smoothly to the booking form.
- **🖼️ Media Showcase & Video Ads**:
  - Embedded HD promotional video players for video ads.
  - Categorized gallery with lightbox image viewer and filter tabs (All, Residential, Commercial, Termites).
- **📋 Real-Time Booking Manager Modal**: Allows clients and administrators to review recent bookings and appointment details directly from the front-end.
- **⭐ Customer Testimonials & Reviews**: Social proof section featuring real client feedback and 5-star ratings.
- **📱 100% Mobile-Friendly & Accessible**: Fully responsive layout tested across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Semantic HTML5, Vanilla CSS3 (Custom Design System, Flexbox, CSS Grid, Glassmorphism), Vanilla JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Data Layer** | File-based JSON Database (`data/bookings.json`) + Client-side `localStorage` Fallback |
| **Icons & Media** | Custom SVG vectors, Responsive images, MP4 promotional videos |
| **Fonts** | Google Fonts (Outfit, Inter, Space Grotesk) |

---

## 📂 Project Structure

```
Phantom Phoenix - Pest Control/
├── .gitignore               # Ignored files (node_modules, logs, system files)
├── LICENSE                  # MIT License
├── README.md                # Project documentation and screenshots
├── index.html               # Main website landing page
├── server.js                # Express.js REST API & static server
├── package.json             # NPM dependencies & scripts
├── package-lock.json        # NPM lockfile
│
├── css/
│   └── style.css            # Core design system, animations & responsive styles
│
├── js/
│   └── main.js              # Client-side interaction, booking logic & modals
│
├── data/
│   └── bookings.json        # Stored booking records
│
├── screenshots/             # High-resolution screenshots of the UI
│   ├── 01_hero_section.png
│   ├── 02_services_section.png
│   └── 03_booking_section.png
│
├── assets/
│   ├── icons/               # SVG brand logos and feature icons
│   ├── images/              # High-resolution service & gallery photos
│   └── videos/              # Video ad creatives (AD 1.mp4, AD 2.mp4)
│
└── Images/                  # Additional raw promotional media
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vaibhav-Waghalkar/Phantom-Phoenix-Website.git
   cd Phantom-Phoenix-Website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   *For development with hot-reloading:*
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bookings` | Fetch all recorded customer bookings |
| `POST` | `/api/bookings` | Submit a new pest control booking request |
| `GET` | `*` | Serves `index.html` single-page interface |

### Sample Booking Payload (`POST /api/bookings`):
```json
{
  "fullName": "Jane Doe",
  "phone": "9876543210",
  "email": "jane@example.com",
  "propertyType": "Home",
  "propertySize": "2 BHK",
  "pestTypes": ["Cockroach Control", "Termite Treatment"],
  "preferredDate": "2026-10-25",
  "preferredTimeSlot": "Morning (9:00 AM - 12:00 PM)",
  "address": "Flat 402, Phoenix Towers, Main Road",
  "notes": "Severe infestation noticed in kitchen cabinets"
}
```

---

## 📞 Business Contact & Helpline

- **Business Name**: Phantom Phoenix Pest Control
- **Phone / Helpline**: [+91 84595 20633](tel:8459520633)
- **WhatsApp**: [Chat on WhatsApp (+91 84595 20633)](https://wa.me/918459520633)
- **Warranty**: 12 Months Free Follow-up Warranty on all specialized treatments

---

## 📄 License

This project is open-source and available under the terms of the [MIT License](LICENSE).
