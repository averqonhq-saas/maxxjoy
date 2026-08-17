/**
 * Invoice & Itinerary Generator for Maxx Joy Tours & Travel Pvt Ltd
 */

export const generateAndDownloadInvoice = (booking, legalSettings = {}) => {
  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceNum = `INV-${bookingId.replace('TRV', '')}-${new Date().getFullYear()}`;
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
  const travelers = booking.travelers || '2 Adults';
  const duration = booking.duration || '5 Days / 4 Nights';

  const totalAmount = typeof booking.totalAmount === 'number' ? booking.totalAmount : (parseFloat(booking.totalAmount) || parseFloat(booking.price) || 1499);
  const paidAmount = typeof booking.amountPaid === 'number' ? booking.amountPaid : (parseFloat(booking.amountPaid) || parseFloat(booking.totalPaid) || totalAmount);
  const balanceDue = typeof booking.balanceDue === 'number' ? booking.balanceDue : (parseFloat(booking.balanceDue) || (totalAmount - paidAmount));
  const currencySymbol = booking.currencySymbol || '₹';

  const basePrice = Math.round(totalAmount * 0.95);
  const gstAmount = Math.round(totalAmount * 0.05);

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
    .invoice-title { font-size: 28px; font-weight: 900; color: #0F172A; text-transform: uppercase; letter-spacing: 1px; }
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
    
    .totals { margin-left: auto; width: 320px; margin-top: 24px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748B; }
    .totals-row.grand { font-size: 18px; font-weight: 900; color: #0F172A; border-top: 2px solid #0F172A; padding-top: 14px; margin-top: 8px; }
    .totals-row.paid { color: #16A34A; font-weight: 800; }
    .totals-row.due { color: #D97706; font-weight: 800; }
    
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

  <div className="invoice-card">
    <!-- Header -->
    <div className="header">
      <div className="brand">
        <div className="brand-logo">M</div>
        <div>
          <div className="brand-name">Maxx <span>Joy</span></div>
          <div className="brand-sub">Tours & Travel Pvt Ltd</div>
        </div>
      </div>

      <div className="invoice-badge">
        <div className="invoice-title">Tax Invoice</div>
        <div className="invoice-num">${invoiceNum}</div>
        <div className="status-tag">Payment Verified ✓</div>
      </div>
    </div>

    <!-- Details Grid -->
    <div className="info-grid">
      <div className="info-box">
        <h4>Issued By</h4>
        <p>
          <strong>${companyName}</strong><br>
          ${companyAddress.replace('\n', '<br>')}<br>
          <strong>Phone:</strong> ${companyPhone}<br>
          <strong>Email:</strong> ${companyEmail}<br>
          <strong>GSTIN:</strong> 33AAACM9804F1Z0
        </p>
      </div>

      <div className="info-box">
        <h4>Billed To (Traveler)</h4>
        <p>
          <strong>${guestName}</strong><br>
          <strong>Email:</strong> ${guestEmail}<br>
          <strong>Mobile:</strong> ${guestPhone}<br>
          <strong>Booking Ref:</strong> ${bookingId}<br>
          <strong>Invoice Date:</strong> ${issueDate}
        </p>
      </div>
    </div>

    <!-- Booking Summary Table -->
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Description & Package</th>
            <th>Travel Details</th>
            <th>Qty</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${tourTitle}</strong><br>
              <span style="font-size: 11px; color: #64748B;">Luxury Hotel Stay, Private Transfers, Sightseeing & Concierge Support</span>
            </td>
            <td>
              <strong>Date:</strong> ${travelDate}<br>
              <span style="font-size: 11px; color: #64748B;">${duration} • ${travelers}</span>
            </td>
            <td>1 Package</td>
            <td style="text-align: right; font-weight: 800;">${currencySymbol}${basePrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td>
              <strong>Taxes & Service Charges</strong><br>
              <span style="font-size: 11px; color: #64748B;">Includes 5% Govt Tourism Tax & GST</span>
            </td>
            <td>Tax Code: GST-5%</td>
            <td>1</td>
            <td style="text-align: right; font-weight: 800;">${currencySymbol}${gstAmount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div className="totals">
      <div className="totals-row">
        <span>Subtotal:</span>
        <span>${currencySymbol}${basePrice.toLocaleString()}</span>
      </div>
      <div className="totals-row">
        <span>GST & Taxes (5%):</span>
        <span>${currencySymbol}${gstAmount.toLocaleString()}</span>
      </div>
      <div className="totals-row grand">
        <span>Total Amount:</span>
        <span>${currencySymbol}${totalAmount.toLocaleString()}</span>
      </div>
      <div className="totals-row paid">
        <span>Amount Received:</span>
        <span>${currencySymbol}${paidAmount.toLocaleString()} ✓</span>
      </div>
      ${balanceDue > 0 ? `
      <div className="totals-row due">
        <span>Balance Due:</span>
        <span>${currencySymbol}${balanceDue.toLocaleString()}</span>
      </div>
      ` : ''}
    </div>

    <!-- Footer Note -->
    <div className="footer-note">
      <p>Thank you for choosing <strong>Maxx Joy Tours and Travel Pvt Ltd</strong> for your journey!</p>
      <p style="margin-top: 4px; font-size: 11px; color: #94A3B8;">For any modifications or travel support, contact us 24/7 at ${companyEmail} or call ${companyPhone}.</p>
      <div className="seal">
        ✓ Official Computer Generated Tax Invoice • Maxx Joy Signature Stamp
      </div>
    </div>

    <!-- Action Buttons for Preview -->
    <div className="actions">
      <button onclick="window.print()" className="btn btn-primary">🖨️ Print / Save as PDF</button>
      <button onclick="window.close()" className="btn btn-secondary">Close</button>
    </div>
  </div>

</body>
</html>`;

  // 1. Open Printable Window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch (e) {}
    }, 500);
  }

  // 2. Also trigger file download as HTML file
  const blob = new Blob([invoiceHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MaxxJoy_Invoice_${bookingId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateAndDownloadItinerary = (booking, legalSettings = {}) => {
  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const tourTitle = booking.packageTitle || booking.title || 'Custom Luxury Tour Package';
  const travelDate = booking.travelDate || booking.date || 'Upcoming Travel';
  const travelers = booking.travelers || '2 Adults';
  const duration = booking.duration || '5 Days / 4 Nights';

  const itineraryText = `=====================================================
MAXX JOY TOURS & TRAVEL PVT LTD — OFFICIAL TRAVEL ITINERARY
=====================================================
Booking Reference: ${bookingId}
Package Title: ${tourTitle}
Travel Date: ${travelDate}
Duration: ${duration}
Travelers: ${travelers}

HEAD OFFICE CONTACT:
Maxx Joy Tours and Travel Pvt Ltd
Address: NO 6 new annai indra nagar maruthamalai, Coimbatore 641046
Phone: +91 9804777879 / +91 7418407088
Emails: Info@maxxjoytours.com | Yogaprathap@maxxjoytours.com | George@maxxjoytours.com

DAY-BY-DAY ITINERARY:
- Day 1: Arrival & Airport Chauffeur Transfer -> Check-in at 5-Star Resort
- Day 2: Guided City Excursion & Sightseeing Tour
- Day 3: Signature Adventure & Evening Sunset Dinner Cruise
- Day 4: Wellness Spa Morning & Local Artisan Shopping
- Day 5: Breakfast & Private Chauffeur Airport Drop-off

IMPORTANT TRAVEL ADVISORY:
• Please present a copy of this itinerary and your Govt ID/Passport at check-in.
• Concierge Support is available 24/7 at +91 9804777879.

Thank you for traveling with Maxx Joy Tours & Travel Pvt Ltd!
=====================================================`;

  const blob = new Blob([itineraryText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MaxxJoy_Itinerary_${bookingId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
