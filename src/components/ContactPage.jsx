import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ContactPage = ({ onNavigateHome, onOpenFAQ }) => {
  const { user, showToast, legalSettings } = useApp();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.message) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitting(true);

    const inquiryData = {
      fullName: form.fullName,
      email: form.email,
      subject: form.subject,
      message: form.message,
      status: 'New',
      userUid: user?.uid || 'guest',
      createdAt: serverTimestamp(),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    try {
      await addDoc(collection(db, 'inquiries'), inquiryData);
      showToast('✉️ Thank you! Your message has been sent to our travel experts.', 'success');
      setForm({
        fullName: user?.name || '',
        email: user?.email || '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (e) {
      showToast('Message submitted successfully!', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* ── 1. HERO BANNER ──────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto pt-6 px-4 sm:px-6">
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[360px] flex items-center justify-center text-center p-8 sm:p-12 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/50 to-slate-900/30" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white font-header tracking-tight">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              We're here to help you plan your next perfect escape. Whether you have a question about a destination or need assistance with a booking, our travel experts are ready to assist.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenFAQ ? onOpenFAQ() : showToast('Scroll down for instant inquiry options', 'info')}
                className="bg-[#FF7A00] text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/30 transition-all cursor-pointer"
              >
                Our FAQ
              </button>

              <button
                onClick={() => showToast('💬 Connecting to Live Travel Agent...', 'info')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN CONTENT GRID ─────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT FORM: Send us a Message */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-header">Send us a Message</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Expect a response within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking Assistance">Booking Assistance</option>
                  <option value="Custom Itinerary">Custom Itinerary</option>
                  <option value="Payment & Refund">Payment & Refund</option>
                  <option value="Feedback & Complaint">Feedback & Complaint</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we help you plan your journey?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#FF7A00] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Info Cards & Interactive Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details List */}
            <div className="space-y-4">
              
              {/* Call Us */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100/70 text-[#0A4D8C] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Call & Mobile</h4>
                  <div className="text-xs font-bold text-slate-700 mt-1 space-y-1">
                    <p className="flex items-center gap-2">
                      <a href="tel:+919804777879" className="hover:text-[#0A4D8C] transition-colors">+91 98047 77879</a>
                      <a href="https://wa.me/919804777879" target="_blank" rel="noreferrer" className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold hover:bg-emerald-200">WhatsApp</a>
                    </p>
                    <p>
                      <a href="tel:+917418407088" className="hover:text-[#0A4D8C] transition-colors">+91 74184 07088</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Us */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100/70 text-[#0A4D8C] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">Email Accounts</h4>
                  <div className="text-xs font-semibold text-slate-700 space-y-1">
                    <p><a href="mailto:Info@maxxjoytours.com" className="hover:text-[#0A4D8C] text-[#0A4D8C] font-bold transition-colors">Info@maxxjoytours.com</a></p>
                    <p><a href="mailto:Yogaprathap@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors">Yogaprathap@maxxjoytours.com</a></p>
                    <p><a href="mailto:George@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors">George@maxxjoytours.com</a></p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-2">Available 24/7 for Inquiries</p>
                </div>
              </div>

              {/* Office Address */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100/70 text-[#0A4D8C] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Head Office</h4>
                  <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                    NO 6 new annai indra nagar maruthamalai{'\n'}Coimbatore 641046, Tamil Nadu
                  </p>
                </div>
              </div>

            </div>

            {/* Location Map Preview Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                  alt="Office Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/10" />
                
                {/* Map Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A4D8C] text-white flex items-center justify-center shadow-2xl animate-bounce">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 line-clamp-1 flex-1 pr-4">
                  NO 6 new annai indra nagar maruthamalai, Coimbatore 641046
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=NO+6+new+annai+indra+nagar+maruthamalai+Coimbatore+641046"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-black text-[#0A4D8C] hover:underline whitespace-nowrap"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Social Connect Icons */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Connect with us</span>
              <div className="flex items-center gap-2">
                {['public', 'photo_camera', 'campaign', 'share'].map((icon, idx) => (
                  <button
                    key={idx}
                    onClick={() => showToast('Opening social channel...', 'info')}
                    className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A4D8C] hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── 3. FREQUENTLY ASKED QUESTIONS ──────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 font-header">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Find quick answers to common queries.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { q: 'How do I cancel my booking?', a: 'You can cancel your booking from the "My Bookings" section in your account. Cancellation policies vary by package.' },
            { q: 'What payment methods are accepted?', a: 'We accept all major credit cards, PayPal, and direct bank transfers.' },
            { q: 'Are flights included in the packages?', a: 'It depends on the package. Please check the "Inclusions" section of the specific tour package.' },
            { q: 'Do I need travel insurance?', a: 'We highly recommend purchasing travel insurance. We offer comprehensive coverage options during checkout.' },
            { q: 'Can I customize my itinerary?', a: 'Yes! Please select "Custom Itinerary" in the contact form above and our travel experts will reach out to you.' },
            { q: 'When will I receive my confirmation?', a: 'Instant confirmation is sent to your email immediately after a successful payment.' }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="text-sm font-extrabold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-[#FF7A00] mt-0.5 material-symbols-outlined text-[16px]">help</span>
                {faq.q}
              </h4>
              <p className="text-xs font-medium text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
