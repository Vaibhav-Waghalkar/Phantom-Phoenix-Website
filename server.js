const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'bookings.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

// API Routes
app.get('/api/bookings', (req, res) => {
  const bookings = getBookings();
  res.json({ success: true, count: bookings.length, bookings });
});

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
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, error: 'A valid 10-digit phone number is required.' });
    }

    if (!preferredDate) {
      return res.status(400).json({ success: false, error: 'Preferred date is required.' });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, error: 'Service address is required.' });
    }

    const bookings = getBookings();
    const newBooking = {
      id: 'PHX-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: (email || '').trim(),
      propertyType: propertyType || 'Home',
      propertySize: propertySize === 'Other' && customPropertySize ? customPropertySize.trim() : (propertySize || '2 BHK'),
      pestTypes: Array.isArray(pestTypes) ? pestTypes : (pestTypes ? [pestTypes] : ['General Pest Control']),
      preferredDate,
      preferredTimeSlot: preferredTimeSlot || 'Morning (9:00 AM - 12:00 PM)',
      address: address.trim(),
      notes: (notes || '').trim(),
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
