/**
 * Phantom Phoenix Pest Control - Main JavaScript Logic
 * Features:
 *  - Responsive navigation & scroll spy
 *  - Interactive service pre-selection into booking form
 *  - Datepicker minimum date restriction (today onwards)
 *  - Comprehensive form validation & inline error tips
 *  - Dual booking storage (Express API + localStorage fallback)
 *  - WhatsApp deep-link generation with formatted message
 *  - Booking confirmation modal & stored bookings viewer
 *  - Gallery category filtering & Lightbox viewer
 *  - Video playback coordination
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const bookingForm = document.getElementById('pestBookingForm');
  const preferredDateInput = document.getElementById('preferredDate');
  const propertySizeSelect = document.getElementById('propertySize');
  const groupCustomSize = document.getElementById('groupCustomSize');
  const customPropertySizeInput = document.getElementById('customPropertySize');
  const serviceBookBtns = document.querySelectorAll('.btn-book-service');

  // Modals
  const successModal = document.getElementById('bookingSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalSuccessHeading = document.getElementById('modalSuccessHeading');
  const modalSuccessMessage = document.getElementById('modalSuccessMessage');
  const modalBookingDetails = document.getElementById('modalBookingDetails');
  const modalWhatsappLink = document.getElementById('modalWhatsappLink');

  const bookingsListModal = document.getElementById('bookingsListModal');
  const viewBookingsBtn = document.getElementById('viewBookingsBtn');
  const closeListModalBtn = document.getElementById('closeListModalBtn');
  const closeListModalBtnBottom = document.getElementById('closeListModalBtnBottom');
  const bookingsListContainer = document.getElementById('bookingsListContainer');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const videoElements = document.querySelectorAll('video');

  const WHATSAPP_PHONE = '918459520633';
  const LOCAL_STORAGE_KEY = 'phantom_phoenix_bookings';

  // =========================================================================
  // 1. STICKY NAVBAR & MOBILE MENU
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  // Active Link Highlighting on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id], footer[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  // =========================================================================
  // 2. DATEPICKER RESTRICTION (TODAY ONWARDS)
  // =========================================================================
  if (preferredDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    preferredDateInput.min = minDateStr;

    // Set default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    preferredDateInput.value = tomorrowStr;
  }

  // =========================================================================
  // 3. PROPERTY SIZE CUSTOM DROPDOWN TOGGLE
  // =========================================================================
  if (propertySizeSelect && groupCustomSize) {
    propertySizeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Other') {
        groupCustomSize.style.display = 'flex';
        customPropertySizeInput.setAttribute('required', 'required');
      } else {
        groupCustomSize.style.display = 'none';
        customPropertySizeInput.removeAttribute('required');
        groupCustomSize.classList.remove('has-error');
      }
    });
  }

  // =========================================================================
  // 4. PRE-FILL SERVICE CARD TO BOOKING FORM
  // =========================================================================
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-name');
      if (!serviceName) return;

      // Uncheck all and check the requested one
      const checkboxes = document.querySelectorAll('input[name="pestTypes"]');
      let matched = false;
      checkboxes.forEach(cb => {
        if (cb.value.toLowerCase() === serviceName.toLowerCase()) {
          cb.checked = true;
          matched = true;
        } else {
          cb.checked = false;
        }
      });

      if (!matched) {
        const first = document.querySelector('input[name="pestTypes"][value="General Pest Control"]');
        if (first) first.checked = true;
      }

      // Scroll smoothly to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        // Focus first field
        setTimeout(() => {
          const nameField = document.getElementById('fullName');
          if (nameField) nameField.focus();
        }, 600);
      }
    });
  });

  // =========================================================================
  // 5. GALLERY FILTERING & LIGHTBOX
  // =========================================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption') || '';
      if (src && lightboxModal && lightboxImg) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================================================
  // 6. VIDEO PLAYBACK COORDINATION
  // =========================================================================
  videoElements.forEach(video => {
    video.addEventListener('play', () => {
      videoElements.forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });

  // =========================================================================
  // 7. FORM VALIDATION & SUBMISSION
  // =========================================================================
  function validateField(groupId, isValid) {
    const group = document.getElementById(groupId);
    if (!group) return isValid;
    if (isValid) {
      group.classList.remove('has-error');
      const input = group.querySelector('.form-control');
      if (input) input.classList.remove('error');
    } else {
      group.classList.add('has-error');
      const input = group.querySelector('.form-control');
      if (input) input.classList.add('error');
    }
    return isValid;
  }

  // Clear errors on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      const parentGroup = input.closest('.form-group');
      if (parentGroup) {
        parentGroup.classList.remove('has-error');
        input.classList.remove('error');
      }
    });
  });

  document.querySelectorAll('input[name="pestTypes"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const groupPests = document.getElementById('groupPestTypes');
      if (groupPests) groupPests.classList.remove('has-error');
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const propertyType = document.getElementById('propertyType').value;
      const propertySize = document.getElementById('propertySize').value;
      const customPropertySize = customPropertySizeInput ? customPropertySizeInput.value.trim() : '';
      const preferredDate = document.getElementById('preferredDate').value;
      const preferredTimeSlot = document.getElementById('preferredTimeSlot').value;
      const address = document.getElementById('address').value.trim();
      const notes = document.getElementById('notes').value.trim();

      // Selected Pests
      const selectedPests = [];
      document.querySelectorAll('input[name="pestTypes"]:checked').forEach(cb => {
        selectedPests.push(cb.value);
      });

      // Validation flags
      let isFormValid = true;

      // 1. Name validation
      if (fullName.length < 2) {
        isFormValid = validateField('groupFullName', false) && isFormValid;
      } else {
        validateField('groupFullName', true);
      }

      // 2. Phone validation (10 digits)
      const cleanPhone = phone.replace(/\D/g, '');
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        isFormValid = validateField('groupPhone', false) && isFormValid;
      } else {
        validateField('groupPhone', true);
      }

      // 3. Email validation (if provided)
      if (email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          isFormValid = validateField('groupEmail', false) && isFormValid;
        } else {
          validateField('groupEmail', true);
        }
      } else {
        validateField('groupEmail', true);
      }

      // 4. Custom Property Size (if Other)
      if (propertySize === 'Other') {
        if (!customPropertySize) {
          isFormValid = validateField('groupCustomSize', false) && isFormValid;
        } else {
          validateField('groupCustomSize', true);
        }
      }

      // 5. Pest Types (at least one)
      if (selectedPests.length === 0) {
        const groupPests = document.getElementById('groupPestTypes');
        if (groupPests) groupPests.classList.add('has-error');
        isFormValid = false;
      } else {
        const groupPests = document.getElementById('groupPestTypes');
        if (groupPests) groupPests.classList.remove('has-error');
      }

      // 6. Date validation (must not be past)
      if (!preferredDate) {
        isFormValid = validateField('groupPreferredDate', false) && isFormValid;
      } else {
        const chosenDate = new Date(preferredDate + 'T00:00:00');
        const todayZero = new Date();
        todayZero.setHours(0, 0, 0, 0);
        if (chosenDate < todayZero) {
          isFormValid = validateField('groupPreferredDate', false) && isFormValid;
        } else {
          validateField('groupPreferredDate', true);
        }
      }

      // 7. Address validation
      if (address.length < 5) {
        isFormValid = validateField('groupAddress', false) && isFormValid;
      } else {
        validateField('groupAddress', true);
      }

      if (!isFormValid) {
        // Scroll to first error
        const firstError = document.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit Button Loading state
      const submitBtn = document.getElementById('submitBookingBtn');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Confirming Booking...</span>`;

      // Booking Payload
      const bookingData = {
        fullName,
        phone: cleanPhone,
        email,
        propertyType,
        propertySize: propertySize === 'Other' ? customPropertySize : propertySize,
        pestTypes: selectedPests,
        preferredDate,
        preferredTimeSlot,
        address,
        notes
      };

      try {
        // Send to backend if server is accessible
        let serverResponse = null;
        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
          });
          if (res.ok) {
            serverResponse = await res.json();
          }
        } catch (apiErr) {
          console.log('Backend API not responding directly, utilizing robust client storage:', apiErr);
        }

        // Store in LocalStorage (client-side fallback & offline persistence)
        saveBookingToLocalStorage(serverResponse ? serverResponse.booking : {
          ...bookingData,
          id: 'PHX-' + Date.now().toString(36).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: 'Confirmed'
        });

        // Show Confirmation Modal
        showSuccessModal(bookingData);

        // Reset form
        bookingForm.reset();
        // Reset default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        preferredDateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
        if (groupCustomSize) groupCustomSize.style.display = 'none';

      } catch (err) {
        console.error('Error saving booking:', err);
        alert('There was an issue processing your booking. Please call us directly on 8459520633.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // =========================================================================
  // 8. BOOKING PERSISTENCE & MODAL PRESENTATION
  // =========================================================================
  function saveBookingToLocalStorage(booking) {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      stored.unshift(booking);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function getStoredBookings() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function showSuccessModal(booking) {
    if (!successModal) return;

    // Requirement:
    // Show success confirmation: "Thanks [Name]! Your booking for [date] at [time slot] is confirmed. We'll call you shortly on [phone]."
    modalSuccessHeading.textContent = "Booking Confirmed!";
    modalSuccessMessage.textContent = `Thanks ${booking.fullName}! Your booking for ${booking.preferredDate} at ${booking.preferredTimeSlot} is confirmed. We'll call you shortly on ${booking.phone}.`;

    // Populate summary details
    modalBookingDetails.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">Name:</span>
        <span class="summary-value">${escapeHtml(booking.fullName)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Phone:</span>
        <span class="summary-value">${escapeHtml(booking.phone)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Property:</span>
        <span class="summary-value">${escapeHtml(booking.propertyType)} (${escapeHtml(booking.propertySize)})</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Service:</span>
        <span class="summary-value text-red">${escapeHtml(booking.pestTypes.join(', '))}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Date & Slot:</span>
        <span class="summary-value">${escapeHtml(booking.preferredDate)} • ${escapeHtml(booking.preferredTimeSlot)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Warranty:</span>
        <span class="summary-value text-gold">12 Months Full Warranty</span>
      </div>
    `;

    // WhatsApp Deep Link with pre-filled message summary
    const waText = encodeURIComponent(
      `Hello Phantom Phoenix Pest Control!\n\n` +
      `I have submitted a booking with the following details:\n` +
      `• Name: ${booking.fullName}\n` +
      `• Phone: ${booking.phone}\n` +
      `• Property: ${booking.propertyType} (${booking.propertySize})\n` +
      `• Services: ${booking.pestTypes.join(', ')}\n` +
      `• Date: ${booking.preferredDate}\n` +
      `• Time Slot: ${booking.preferredTimeSlot}\n` +
      `• Address: ${booking.address}\n` +
      (booking.notes ? `• Notes: ${booking.notes}\n` : '') +
      `\nPlease confirm the technician arrival.`
    );

    modalWhatsappLink.href = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;

    // Display modal
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Modal Dismiss actions
  function hideSuccessModal() {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', hideSuccessModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', hideSuccessModal);
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) hideSuccessModal();
    });
  }

  // =========================================================================
  // 9. STORED BOOKINGS VIEWER
  // =========================================================================
  if (viewBookingsBtn && bookingsListModal) {
    viewBookingsBtn.addEventListener('click', async () => {
      let bookings = getStoredBookings();

      // Try fetching newest from server API as well
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.bookings && data.bookings.length > 0) {
            bookings = data.bookings;
          }
        }
      } catch (err) {
        // use local storage
      }

      renderStoredBookings(bookings);
      bookingsListModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function renderStoredBookings(bookings) {
    if (!bookingsListContainer) return;

    if (!bookings || bookings.length === 0) {
      bookingsListContainer.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #64748b;">
          <p>No bookings found yet. Use the booking form above to schedule your first service!</p>
        </div>
      `;
      return;
    }

    bookingsListContainer.innerHTML = bookings.map(b => `
      <div class="booking-list-item">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:1.05rem; color:#0f172a;">${escapeHtml(b.fullName)}</strong>
          <span style="font-size:0.75rem; background:#25d366; color:#fff; padding:2px 8px; border-radius:10px; font-weight:700;">
            ${escapeHtml(b.status || 'Confirmed')}
          </span>
        </div>
        <div style="font-size:0.85rem; color:#475569;">
          <span>📞 ${escapeHtml(b.phone)}</span> • <span>🏠 ${escapeHtml(b.propertyType)} (${escapeHtml(b.propertySize || 'N/A')})</span>
        </div>
        <div style="font-size:0.85rem; color:#e02020; font-weight:600;">
          <span>🐛 Pests: ${escapeHtml(Array.isArray(b.pestTypes) ? b.pestTypes.join(', ') : b.pestTypes)}</span>
        </div>
        <div style="font-size:0.82rem; color:#64748b;">
          <span>📅 Date: ${escapeHtml(b.preferredDate)} (${escapeHtml(b.preferredTimeSlot)})</span>
        </div>
        <div style="font-size:0.8rem; color:#94a3b8; background:#f8fafc; padding:6px 10px; border-radius:4px; margin-top:4px;">
          📍 ${escapeHtml(b.address)}
        </div>
      </div>
    `).join('');
  }

  function hideListModal() {
    if (bookingsListModal) {
      bookingsListModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeListModalBtn) closeListModalBtn.addEventListener('click', hideListModal);
  if (closeListModalBtnBottom) closeListModalBtnBottom.addEventListener('click', hideListModal);
  if (bookingsListModal) {
    bookingsListModal.addEventListener('click', (e) => {
      if (e.target === bookingsListModal) hideListModal();
    });
  }

  // Utility to prevent XSS
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
