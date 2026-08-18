/**
 * Invoice & Itinerary Generator for Maxx Joy Tours & Travel Pvt Ltd
 */

export const generateAndDownloadInvoice = (booking, legalSettings = {}) => {
  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceNum = `INV-${bookingId.replace('TRV-', '').replace('TRV', '')}-${new Date().getFullYear()}`;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const isPlaceholder = (str) => !str || str.includes('Perfect Travel') || str.includes('123 Adventure') || str.includes('555') || str.includes('perfecttravel');

  const companyName = isPlaceholder(legalSettings.companyName) ? 'Maxx Joy Tours and Travel Pvt Ltd' : legalSettings.companyName;
  const companyAddress = isPlaceholder(legalSettings.address) ? 'NO 6 new annai indra nagar maruthamalai\nCoimbatore 641046, Tamil Nadu' : legalSettings.address;
  const companyPhone = isPlaceholder(legalSettings.phone) ? '+91 98047 77879 / +91 74184 07088' : legalSettings.phone;
  const companyEmail = isPlaceholder(legalSettings.email) ? 'Info@maxxjoytours.com' : legalSettings.email;

  const rawGuestEmail = booking.email || booking.guestEmail || booking.userEmail;
  const guestName = booking.fullName || booking.guestName || booking.name || 'Valued Traveler';
  const guestEmail = (!rawGuestEmail || rawGuestEmail.includes('example.com')) ? 'Info@maxxjoytours.com' : rawGuestEmail;
  const guestPhone = booking.phone || booking.guestPhone || '+91 98047 77879';
  
  const tourTitle = booking.packageTitle || booking.title || 'Custom Luxury Tour Package';
  const travelDate = booking.travelDate || booking.date || 'Upcoming Travel';
  const duration = booking.duration || '5 Days / 4 Nights';

  const adults = parseInt(booking.adults) || 2;
  const children = parseInt(booking.children) || 0;
  const travelers = booking.travelers || `${adults} Adults${children > 0 ? `, ${children} Children` : ''}`;

  const totalAmount = typeof booking.estimatedCost === 'number' && booking.estimatedCost > 0
    ? booking.estimatedCost
    : (typeof booking.totalAmount === 'number' && booking.totalAmount > 0
      ? booking.totalAmount
      : (parseFloat(booking.estimatedCost) || parseFloat(booking.totalAmount) || ((parseFloat(booking.price || booking.basePrice) || 1499) * adults)));

  const perAdultPrice = booking.price ? parseFloat(booking.price) : Math.round(totalAmount / (adults + children * 0.6));
  const perChildPrice = Math.round(perAdultPrice * 0.6);
  const totalAdultFare = perAdultPrice * adults;
  const totalChildFare = perChildPrice * children;

  const basePrice = Math.round(totalAmount * 0.95);
  const gstAmount = totalAmount - basePrice;
  const currencySymbol = booking.currencySymbol || '₹';

  const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice - ${bookingId} - Maxx Joy Tours</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; color: #0F172A; background: #F8FAFC; padding: 40px 20px; }
    
    .invoice-card { max-width: 800px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; padding: 48px; border: 1px solid #E2E8F0; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05); }
    
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 32px; border-bottom: 2px dashed #E2E8F0; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-logo { width: 52px; height: 52px; background: #0A4D8C; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 26px; font-weight: 900; }
    .brand-name { font-size: 22px; font-weight: 900; color: #0A4D8C; letter-spacing: -0.5px; }
    .brand-name span { color: #F59E0B; }
    .brand-sub { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; }
    
    .invoice-badge { text-align: right; }
    .invoice-title { font-size: 24px; font-weight: 900; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; }
    .invoice-num { font-size: 13px; font-weight: 700; color: #0A4D8C; margin-top: 4px; font-family: monospace; }
    .status-tag { display: inline-block; padding: 4px 12px; background: #DCFCE7; color: #15803D; font-size: 11px; font-weight: 800; border-radius: 20px; margin-top: 8px; text-transform: uppercase; border: 1px solid #BBF7D0; }
    
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 32px 0; }
    .info-box h4 { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; margin-bottom: 8px; }
    .info-box p { font-size: 13px; font-weight: 600; color: #334155; line-height: 1.6; }
    .info-box strong { color: #0F172A; font-weight: 800; }
    
    .table-container { margin: 32px 0; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #F1F5F9; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569; padding: 16px 20px; }
    td { padding: 18px 20px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #F1F5F9; color: #334155; }
    tr:last-child td { border-bottom: none; }
    
    .totals { margin-left: auto; width: 340px; margin-top: 24px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748B; }
    .totals-row.grand { font-size: 18px; font-weight: 900; color: #0F172A; border-top: 2px solid #0F172A; padding-top: 14px; margin-top: 8px; }
    .totals-row.paid { color: #16A34A; font-weight: 800; }
    
    .footer-note { margin-top: 48px; padding-top: 24px; border-top: 1px solid #E2E8F0; text-align: center; }
    .footer-note p { font-size: 12px; font-weight: 600; color: #64748B; }
    .seal { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 8px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; font-size: 11px; font-weight: 800; color: #0A4D8C; }
    
    .actions { display: flex; justify-content: center; gap: 16px; margin-top: 32px; }
    .btn { padding: 12px 28px; border-radius: 14px; font-size: 13px; font-weight: 800; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: #0A4D8C; color: #FFFFFF; box-shadow: 0 4px 14px rgba(10,77,140,0.3); }
    .btn-primary:hover { background: #073C6E; }
    .btn-secondary { background: #E2E8F0; color: #0F172A; }
    .btn-secondary:hover { background: #CBD5E1; }
    
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 20px; }
      .actions { display: none; }
    }
  </style>
</head>
<body>

  <div class="invoice-card">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-logo">M</div>
        <div>
          <div class="brand-name">Maxx <span>Joy</span></div>
          <div class="brand-sub">Tours & Travel Pvt Ltd</div>
        </div>
      </div>

      <div class="invoice-badge">
        <div class="invoice-title">Booking Quotation & Invoice</div>
        <div class="invoice-num">${invoiceNum}</div>
        <div class="status-tag" style="background: #DCFCE7; color: #15803D; border-color: #BBF7D0;">${booking.status || 'Confirmed Quote'}</div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="info-grid">
      <div class="info-box">
        <h4>Issued By</h4>
        <p>
          <strong>${companyName}</strong><br>
          ${companyAddress.replace(/\n/g, '<br>')}<br>
          <strong>Phone:</strong> ${companyPhone}<br>
          <strong>Email:</strong> ${companyEmail}<br>
          <strong>GSTIN:</strong> 33AAACM9804F1Z0
        </p>
      </div>

      <div class="info-box">
        <h4>Traveler & Requirements</h4>
        <p>
          <strong>Lead Guest:</strong> ${guestName}<br>
          <strong>Email:</strong> ${guestEmail}<br>
          <strong>Mobile / WhatsApp:</strong> ${guestPhone}<br>
          <strong>Hotel Preference:</strong> ${booking.hotelPreference || '4 Star Accommodation'}<br>
          <strong>Transport:</strong> ${[booking.transportRequired?.airportPickup && 'Airport Pickup', booking.transportRequired?.localTransportation && 'Local Transportation'].filter(Boolean).join(', ') || 'Standard'}<br>
          <strong>Booking Ref:</strong> #${bookingId}<br>
          <strong>Travel Date:</strong> ${travelDate}
        </p>
      </div>
    </div>

    <!-- Booking Summary Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Description & Package</th>
            <th>Travel Details</th>
            <th>Travellers / Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${tourTitle}</strong><br>
              <span style="font-size: 11px; color: #64748B;">Hotel: ${booking.hotelPreference || '4 Star'} Class • Guided Tours & Transfers</span>
            </td>
            <td>
              <strong>Date:</strong> ${travelDate}<br>
              <span style="font-size: 11px; color: #64748B;">${duration}</span>
            </td>
            <td>${adults} Adult(s)</td>
            <td style="text-align: right; font-weight: 800;">${currencySymbol}${totalAdultFare.toLocaleString()}</td>
          </tr>
          ${children > 0 ? `
          <tr>
            <td>
              <strong>Child Fare (Special Rate)</strong><br>
              <span style="font-size: 11px; color: #64748B;">Extra Bed, Meals & Child Excursions</span>
            </td>
            <td>Child Rate</td>
            <td>${children} Child</td>
            <td style="text-align: right; font-weight: 800;">${currencySymbol}${totalChildFare.toLocaleString()}</td>
          </tr>
          ` : ''}
          <tr>
            <td>
              <strong>Inclusions & Logistics</strong><br>
              <span style="font-size: 11px; color: #64748B;">Transfers, Guided Itineraries & Concierge Desk</span>
            </td>
            <td>All Logistics</td>
            <td>Included</td>
            <td style="text-align: right; font-weight: 800; color: #16A34A;">Included</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row">
        <span>Base Package Fare (95%):</span>
        <span>${currencySymbol}${basePrice.toLocaleString()}</span>
      </div>
      <div class="totals-row">
        <span>GST & Taxes (5%):</span>
        <span>${currencySymbol}${gstAmount.toLocaleString()}</span>
      </div>
      <div class="totals-row grand">
        <span>Confirmed / Estimated Total:</span>
        <span>${currencySymbol}${totalAmount.toLocaleString()}</span>
      </div>
      <div class="totals-row" style="color: #0A4D8C; font-weight: 800;">
        <span>Payment Condition:</span>
        <span>Enquiry Based (No Online Advance)</span>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="footer-note">
      <p>Thank you for choosing <strong>Maxx Joy Tours and Travel Pvt Ltd</strong>. We are committed to making your journey unforgettable!</p>
      <div class="seal">
        <span>✓ Verified Computer Generated Tax Invoice • Maxx Joy Official Signature Stamp</span>
      </div>
    </div>

    <!-- Screen Buttons -->
    <div class="actions">
      <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
      <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
    </div>
  </div>

</body>
</html>`;

  // Open the printable HTML in a new tab or trigger a print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch {}
    }, 500);
  }
};

export const generateAndDownloadItinerary = (booking) => {
  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const tourTitle = booking.packageTitle || 'Custom Tour Package';
  const travelDate = booking.travelDate || 'Selected Travel Date';
  
  const itineraryText = `=====================================================
MAXX JOY TOURS AND TRAVEL PVT LTD - OFFICIAL ITINERARY
=====================================================
Booking Reference : #${bookingId}
Tour Package      : ${tourTitle}
Lead Traveler     : ${booking.guestName || 'Traveler'}
Travel Date       : ${travelDate}
Total Travelers   : ${booking.travelers || '2 Adults'}
Hotel Preference  : ${booking.hotelPreference || '4 Star Accommodation'}
Status            : ${booking.status || 'Confirmed'}

=====================================================
TOUR SCHEDULE & ITINERARY HIGHLIGHTS:
=====================================================
Day 1: Arrival, VIP Airport Meet & Greet, Private Transfer to Hotel Check-in
Day 2: Morning City Highlights Tour & Afternoon Leisure
Day 3: Signature Excursion & Sunset Sightseeing Experience
Day 4: Guided Cultural & Adventure Tours with Traditional Lunch
Day 5: Hotel Check-out, Souvenir Shopping & Airport Departure Transfer

=====================================================
CUSTOMER SUPPORT & CONCIERGE:
=====================================================
Phone / WhatsApp : +91 98047 77879 / +91 74184 07088
Official Email   : Info@maxxjoytours.com
Registered Office: NO 6 new annai indra nagar maruthamalai, Coimbatore 641046

Thank you for traveling with Maxx Joy Tours!
`;

  const blob = new Blob([itineraryText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Itinerary_${bookingId}_MaxxJoy.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
