const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Serve static frontend assets
app.use(express.static(__dirname));

// Ensure data folder and bookings.json exist
function getBookings() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading bookings file:', err);
    return [];
  }
}

function saveBookings(bookings) {
  // Write to temporary file first then rename for atomic write safety
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(bookings, null, 2), 'utf8');
  fs.renameSync(tempFile, DATA_FILE);
}

// Optional Admin API Key authorization for administrative GET endpoint
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

// API Routes
// GET /api/bookings - Protected: Requires X-Admin-Key if ADMIN_API_KEY is configured in environment
app.get('/api/bookings', (req, res) => {
  if (ADMIN_API_KEY) {
    const providedKey = req.headers['x-admin-key'] || req.query.apiKey;
    if (providedKey !== ADMIN_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Protected administrative endpoint.'
      });
    }
  }

  const bookings = getBookings();
  res.json({ success: true, count: bookings.length, bookings });
});

// Allowed values for strict enum validation
const ALLOWED_PROPERTY_TYPES = ['Home', 'Office', 'Hotel / Restaurant', 'Commercial / Warehouse'];
const ALLOWED_TIME_SLOTS = [
  'Morning (9:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 3:00 PM)',
  'Evening (3:00 PM - 6:00 PM)',
  'Late Evening (6:00 PM - 9:00 PM)'
];
const ALLOWED_PEST_TYPES = [
  'General Pest Control',
  'Cockroach Control',
  'Termite Treatment',
  'Bedbugs Treatment',
  'Rat & Rodent Control',
  'Mosquito Control'
];

app.post('/api/bookings', (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      propertyType,
      propertySize,
      customPropertySize,
      pestTypes,
      preferredDate,
      preferredTimeSlot,
      address,
      notes
    } = req.body;

    // Validate required fields
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (fullName.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Full name exceeds maximum allowed length (100 characters).' });
    }

    const cleanPhone = (typeof phone === 'string' ? phone : String(phone || '')).replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return res.status(400).json({ success: false, error: 'A valid 10-digit phone number is required.' });
    }

    if (email && (typeof email !== 'string' || email.trim().length > 120)) {
      return res.status(400).json({ success: false, error: 'Email address exceeds maximum allowed length.' });
    }

    if (!preferredDate || typeof preferredDate !== 'string') {
      return res.status(400).json({ success: false, error: 'Preferred date is required.' });
    }
    // Validate ISO date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate.trim())) {
      return res.status(400).json({ success: false, error: 'Preferred date must follow YYYY-MM-DD format.' });
    }

    if (!address || typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ success: false, error: 'Service address is required.' });
    }
    if (address.trim().length > 300) {
      return res.status(400).json({ success: false, error: 'Service address exceeds maximum allowed length (300 characters).' });
    }

    if (notes && (typeof notes !== 'string' || notes.trim().length > 500)) {
      return res.status(400).json({ success: false, error: 'Notes exceed maximum allowed length (500 characters).' });
    }

    // Property Type
    const safePropertyType = ALLOWED_PROPERTY_TYPES.includes(propertyType) ? propertyType : 'Home';

    // Property Size
    let safePropertySize = '2 BHK';
    if (propertySize === 'Other' && customPropertySize && typeof customPropertySize === 'string') {
      safePropertySize = customPropertySize.trim().slice(0, 50);
    } else if (typeof propertySize === 'string' && propertySize.trim()) {
      safePropertySize = propertySize.trim().slice(0, 50);
    }

    // Time Slot
    const safeTimeSlot = ALLOWED_TIME_SLOTS.includes(preferredTimeSlot)
      ? preferredTimeSlot
      : 'Morning (9:00 AM - 12:00 PM)';

    // Pest Types
    let safePestTypes = [];
    if (Array.isArray(pestTypes)) {
      safePestTypes = pestTypes
        .filter(p => typeof p === 'string' && ALLOWED_PEST_TYPES.includes(p.trim()))
        .map(p => p.trim());
    } else if (typeof pestTypes === 'string' && ALLOWED_PEST_TYPES.includes(pestTypes.trim())) {
      safePestTypes = [pestTypes.trim()];
    }
    if (safePestTypes.length === 0) {
      safePestTypes = ['General Pest Control'];
    }

    const bookings = getBookings();
    const newBooking = {
      id: 'PHX-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
      fullName: fullName.trim().slice(0, 100),
      phone: cleanPhone,
      email: email && typeof email === 'string' ? email.trim().slice(0, 120) : '',
      propertyType: safePropertyType,
      propertySize: safePropertySize,
      pestTypes: safePestTypes,
      preferredDate: preferredDate.trim(),
      preferredTimeSlot: safeTimeSlot,
      address: address.trim().slice(0, 300),
      notes: notes && typeof notes === 'string' ? notes.trim().slice(0, 500) : '',
      warranty: '12 Months Warranty Included',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    saveBookings(bookings);

    console.log(`[Phantom Phoenix] New booking received: ${newBooking.id} for ${newBooking.fullName} (${newBooking.phone})`);

    res.status(201).json({
      success: true,
      message: `Thanks ${newBooking.fullName}! Your booking for ${newBooking.preferredDate} at ${newBooking.preferredTimeSlot} is confirmed. We'll call you shortly on ${newBooking.phone}.`,
      booking: newBooking
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, error: 'Server error processing booking request.' });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Phantom Phoenix Pest Control Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Bookings API: http://localhost:${PORT}/api/bookings`);
  console.log(`=======================================================`);
});
