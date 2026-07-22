import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Phone, MapPin, Mail, MessageSquare, ChevronDown, CheckCircle, Moon, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_URL } from '../services/api';

export default function TemplateRenderer({ business, isPreview = false }) {
  const { businessName, category, address, phone, whatsapp, template, theme, content, slug } = business;
  const { hero, about, services = [], faqs = [], contact } = content;

  // Render State
  const [themeMode, setThemeMode] = useState('light'); // light or dark for the tenant site
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    bookingDate: '',
    bookingTime: '',
    service: services[0]?.name || 'General Inquiry'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  // Handle local dark/light toggle
  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  // Handle Booking Submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (isPreview) {
      alert('This is a preview mode. Booking forms will not submit to the database.');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch(`${API_URL}/public/site/${slug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setWhatsappLink(data.whatsappLink);
        setBookingSuccess(true);
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'Error scheduling booking');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // Determine site colors based on Light/Dark mode and business theme
  const getColors = () => {
    const isDark = themeMode === 'dark';
    return {
      primary: theme.primaryColor || '#3B82F6',
      secondary: theme.secondaryColor || '#10B981',
      bg: isDark ? '#111827' : (theme.backgroundColor || '#FFFFFF'),
      text: isDark ? '#F9FAFB' : (theme.textColor || '#1F2937'),
      cardBg: isDark ? '#1F2937' : '#F3F4F6',
      cardText: isDark ? '#E5E7EB' : '#374151',
      mutedText: isDark ? '#9CA3AF' : '#6B7280'
    };
  };

  const colors = getColors();

  // Helper styles
  const btnStyle = {
    backgroundColor: colors.primary,
    color: '#ffffff'
  };

  const borderStyle = {
    borderColor: `${colors.primary}20`
  };

  // Animated templates renderer
  const renderTemplateContent = () => {
    switch (template) {
      case 'classic':
        return renderClassic();
      case 'minimalist':
        return renderMinimalist();
      case 'hightech':
        return renderHighTech();
      case 'modern':
      default:
        return renderModern();
    }
  };

  // ----------------------------------------------------
  // TEMPLATE 1: MODERN (Glassmorphism, rounded layout, modern)
  // ----------------------------------------------------
  const renderModern = () => {
    return (
      <div style={{ backgroundColor: colors.bg, color: colors.text }} className="transition-colors duration-300 min-h-screen font-sans">
        {/* Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-200/10" style={{ backgroundColor: `${colors.bg}dd` }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <span className="text-2xl font-bold tracking-tight">{businessName}</span>
            <div className="flex items-center space-x-6">
              <a href="#about" className="hover:opacity-80 transition">About</a>
              <a href="#services" className="hover:opacity-80 transition">Services</a>
              <a href="#faqs" className="hover:opacity-80 transition">FAQs</a>
              <a href="#book" className="px-4 py-2 rounded-full font-medium hover:scale-105 transition duration-200 text-sm" style={btnStyle}>
                Book Appointment
              </a>
              <button onClick={toggleThemeMode} className="p-2 rounded-full hover:bg-gray-500/10">
                {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-opacity-10" style={{ backgroundColor: colors.primary, color: colors.primary }}>
                {category.replace('-', ' ')}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {hero?.title || `Premium services at ${businessName}`}
              </h1>
              <p className="text-lg opacity-85 leading-relaxed">
                {hero?.subtitle || 'Generating customized website layouts, copywriting, and visual systems.'}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#book" className="px-8 py-3.5 rounded-xl font-semibold hover:opacity-95 transition shadow-lg" style={btnStyle}>
                  {hero?.ctaText || 'Get Started'}
                </a>
                <a href="#services" className="px-8 py-3.5 rounded-xl font-semibold border hover:bg-gray-500/5 transition" style={{ borderColor: colors.primary }}>
                  View Services
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-slate-800"
            >
              <img 
                src={hero?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"} 
                alt="Business Hero"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-6 border-t border-b border-opacity-10" style={borderStyle}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-xl h-[350px] bg-slate-800">
              <img 
                src={about?.imageUrl || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"} 
                alt="About Us"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold tracking-tight">{about?.title || 'Our Legacy'}</h2>
              <p className="text-base opacity-80 leading-relaxed whitespace-pre-line">
                {about?.story || 'AI Generated content is ready. Edit your details on the dashboard.'}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Services & Offerings</h2>
              <p className="max-w-lg mx-auto opacity-75">Check out our premium services curated especially for your satisfaction.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((svc, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl p-6 transition duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{svc.name}</h3>
                    <p className="text-sm opacity-80" style={{ color: colors.cardText }}>{svc.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-500/10 flex justify-between items-center">
                    <span className="font-semibold text-lg" style={{ color: colors.primary }}>{svc.price}</span>
                    {svc.duration && <span className="text-xs opacity-60 flex items-center gap-1"><Clock size={12} /> {svc.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="py-20 px-6 border-t border-opacity-10" style={borderStyle}>
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="rounded-xl overflow-hidden border border-opacity-10"
                  style={{ borderColor: colors.primary, backgroundColor: colors.cardBg }}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-5 text-left font-semibold flex justify-between items-center transition hover:bg-gray-500/5"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`transition duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="p-5 pt-0 border-t border-gray-500/5 text-sm opacity-80 leading-relaxed" style={{ color: colors.cardText }}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact and Booking Form */}
        <section id="book" className="py-20 px-6 border-t border-opacity-10" style={borderStyle}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="opacity-80">We would love to hear from you. Have inquiries, comments or special requests? Drop us a message.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-opacity-10" style={{ backgroundColor: colors.primary, color: colors.primary }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm opacity-70">Location</h4>
                    <p className="font-medium">{address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-opacity-10" style={{ backgroundColor: colors.primary, color: colors.primary }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm opacity-70">Call Us</h4>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
                {contact?.email && (
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-opacity-10" style={{ backgroundColor: colors.primary, color: colors.primary }}>
                      <Mail size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm opacity-70">Email Address</h4>
                      <p className="font-medium">{contact.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-green-500/10 text-green-500">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm opacity-70">WhatsApp Support</h4>
                    <p className="font-medium">{whatsapp}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: colors.cardBg }}>
              <h3 className="text-2xl font-bold mb-6">Schedule an Appointment</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    name="customerName"
                    required
                    value={bookingForm.customerName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none"
                    style={{ '--tw-ring-color': colors.primary }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={bookingForm.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={bookingForm.phone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Date</label>
                    <input 
                      type="date" 
                      name="bookingDate"
                      required
                      value={bookingForm.bookingDate}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Time</label>
                    <input 
                      type="time" 
                      name="bookingTime"
                      required
                      value={bookingForm.bookingTime}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">Select Service</label>
                  <select 
                    name="service"
                    value={bookingForm.service}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-500/20 bg-transparent focus:ring-2 focus:outline-none text-slate-800 dark:text-slate-100 dark:bg-slate-800"
                  >
                    {services.map((s, i) => (
                      <option key={i} value={s.name}>{s.name} ({s.price})</option>
                    ))}
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="w-full py-4 rounded-xl font-bold hover:scale-[1.01] transition duration-200 mt-2 shadow-lg disabled:opacity-50"
                  style={btnStyle}
                >
                  {bookingLoading ? 'Scheduling...' : 'Reserve Appointment'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm opacity-60 border-t border-gray-500/10">
          <p>© {new Date().getFullYear()} {businessName}. Generated with Build It All.</p>
        </footer>
      </div>
    );
  };

  // ----------------------------------------------------
  // TEMPLATE 4: HIGH-TECH (Futuristic HUD, neural diagnostics, scanning lines)
  // ----------------------------------------------------
  const renderHighTech = () => {
    const primaryNeon = theme.primaryColor || '#00ffcc';
    const secondaryNeon = theme.secondaryColor || '#ff0055';
    
    return (
      <div className="min-h-screen bg-[#050508] text-slate-100 font-mono relative overflow-hidden selection:bg-[#00ffcc] selection:text-black">
        {/* Futuristic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Scanning horizontal neon laser line */}
        <div 
          className="absolute left-0 w-full h-[2px] opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(to_right, transparent, ${primaryNeon}, transparent)`,
            top: '25%',
            animation: 'scan 8s linear infinite'
          }}
        />

        <style>{`
          @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
          .tech-bracket {
            position: relative;
          }
          .tech-bracket::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            width: 12px;
            height: 12px;
            border-top: 2px solid var(--neon-color);
            border-left: 2px solid var(--neon-color);
          }
          .tech-bracket::after {
            content: '';
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            border-bottom: 2px solid var(--neon-color);
            border-right: 2px solid var(--neon-color);
          }
        `}</style>

        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-[#050508]/85 backdrop-blur-md border-b border-white/5 py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                {businessName}
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 font-normal">SYS_V2.0</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-widest font-semibold">
              <a href="#diagnostics" className="hover:text-cyan-400 transition">Diagnostics</a>
              <a href="#services" className="hover:text-cyan-400 transition">Grid Modules</a>
              <a href="#faqs" className="hover:text-cyan-400 transition">Diag Core</a>
              <a 
                href="#book" 
                className="px-4 py-2 border rounded text-xs font-bold transition hover:bg-white/5" 
                style={{ borderColor: primaryNeon, color: primaryNeon, '--neon-color': primaryNeon }}
              >
                Book Module
              </a>
              <button onClick={toggleThemeMode} className="p-2 rounded border border-white/5 text-slate-400 hover:text-white">
                {themeMode === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] rounded uppercase tracking-wider">
              <span>System Core Mode: {category.replace('-', ' ')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
              {hero?.title || `Accessing ${businessName}`}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-light border-l-2 border-purple-500/30 pl-4 py-1">
              {hero?.subtitle || 'Quantum-synthesized local business parameters configured.'}
            </p>
            
            {/* Quick Terminal Logs widget */}
            <div className="p-4 bg-[#0a0a14] border border-white/5 rounded-xl text-[10px] font-mono text-slate-500 space-y-1">
              <p className="text-emerald-400 font-bold">[SYS] Initialize neural hotel deck... SUCCESS</p>
              <p>[SYS] Fetching suite status vectors... OK (16 nodes active)</p>
              <p className="text-purple-400 font-bold">[NET] Stripe Gateway Status: ACTIVE (Bypass Enabled)</p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#book" className="px-6 py-3 border font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition" style={{ backgroundColor: primaryNeon, borderColor: primaryNeon, color: '#000000' }}>
                {hero?.ctaText || 'Initialize Reservation'}
              </a>
              <a href="#services" className="px-6 py-3 border border-white/10 font-bold text-xs uppercase tracking-wider hover:border-white/20 hover:bg-white/5 transition">
                Load Grid Modules
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 h-[380px] bg-slate-950 p-2 tech-bracket" style={{ '--neon-color': primaryNeon }}>
            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              Live Feed
            </div>
            <img 
              src={hero?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"} 
              alt="Futuristic Hotel View"
              className="w-full h-full object-cover rounded-xl filter brightness-90 grayscale-[20%]"
            />
          </div>
        </section>

        {/* DIAGNOSTICS & SYSTEM STATUS BAR (Uninserted High-Tech elements) */}
        <section id="diagnostics" className="py-12 border-y border-white/5 bg-[#08080f] px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6 text-center">Diagnostics Status Core System</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-[#0c0c16] border border-white/5 rounded-xl space-y-1 relative tech-bracket" style={{ '--neon-color': primaryNeon }}>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Neural Interface</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">Quantum Key v2</span>
                <span className="text-[8px] text-emerald-500 block uppercase font-semibold">● Online & Enforced</span>
              </div>
              <div className="p-4 bg-[#0c0c16] border border-white/5 rounded-xl space-y-1 relative tech-bracket" style={{ '--neon-color': secondaryNeon }}>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Climate Matrix</span>
                <span className="text-sm font-bold text-white font-mono">Auto-Opt 21.5°C</span>
                <span className="text-[8px] text-emerald-500 block uppercase font-semibold">● HEPA Flow Peak</span>
              </div>
              <div className="p-4 bg-[#0c0c16] border border-white/5 rounded-xl space-y-1 relative tech-bracket" style={{ '--neon-color': primaryNeon }}>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Room Grid Occupancy</span>
                <span className="text-sm font-bold text-purple-400 font-mono">13 / 16 active</span>
                <span className="text-[8px] text-cyan-400 block uppercase font-semibold">● 81.2% Cap Load</span>
              </div>
              <div className="p-4 bg-[#0c0c16] border border-white/5 rounded-xl space-y-1 relative tech-bracket" style={{ '--neon-color': secondaryNeon }}>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Smart Concierge</span>
                <span className="text-sm font-bold text-white font-mono">Gemini-AI Node</span>
                <span className="text-[8px] text-emerald-500 block uppercase font-semibold">● Core Synced</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Room Matrix Grid */}
        {category.toLowerCase() === 'hotel' && (
          <section className="py-20 max-w-7xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Quantum Room Grid Matrix</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Interactive HUD capsule array selector. Blinking cells represent active network node connections.</p>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
              {[...Array(16)].map((_, i) => {
                const isOccupied = [1, 3, 4, 7, 8, 10, 11, 13, 15].includes(i);
                const isBlinking = [4, 7, 13].includes(i);
                const roomNum = 101 + i * 3;
                return (
                  <div 
                    key={i}
                    className={`p-3.5 border rounded-xl flex flex-col justify-between items-center aspect-square transition duration-300 group cursor-pointer ${
                      isOccupied 
                        ? 'border-red-500/20 bg-red-950/10 text-red-400 hover:border-red-500/40' 
                        : 'border-cyan-500/20 bg-cyan-950/10 text-cyan-400 hover:border-cyan-500/40'
                    }`}
                  >
                    <span className="text-[9px] opacity-65 font-bold">#{roomNum}</span>
                    <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-cyan-400'} ${isBlinking ? 'animate-ping' : ''}`} />
                    <span className="text-[8px] uppercase font-semibold tracking-wider font-mono">
                      {isOccupied ? 'OCC' : 'VAC'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* About Section */}
        <section id="about" className="py-20 px-6 bg-[#08080c] border-y border-white/5">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-[340px] bg-slate-950 p-2 order-2 md:order-1 tech-bracket" style={{ '--neon-color': secondaryNeon }}>
              <img 
                src={about?.imageUrl || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"} 
                alt="Diagnostics Core Story"
                className="w-full h-full object-cover rounded-xl filter grayscale contrast-125"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-bold uppercase tracking-wider text-white">{about?.title || 'System Protocol Story'}</h2>
              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line border-l-2 border-cyan-500/20 pl-4 py-1">
                {about?.story || 'AI Generated content is ready. Edit your details on the dashboard.'}
              </p>
            </div>
          </div>
        </section>

        {/* Services Section (Grid Modules) */}
        <section id="services" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold uppercase tracking-wider text-white">System Grid Modules</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">Selectable service pipelines config parameters and pricing.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <div 
                key={i} 
                className="p-6 bg-[#0a0a14] border border-white/5 rounded-2xl relative flex flex-col justify-between h-[250px] transition hover:border-cyan-500/30 tech-bracket"
                style={{ '--neon-color': primaryNeon }}
              >
                <div className="space-y-3">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Module 0{i + 1}</span>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{svc.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{svc.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="font-extrabold text-cyan-400 text-sm tracking-wider">{svc.price}</span>
                  {svc.duration && <span className="opacity-55 flex items-center gap-1 font-mono text-[9px]"><Clock size={10} /> {svc.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Diagnostics */}
        <section id="faqs" className="py-20 px-6 bg-[#08080c] border-t border-white/5">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-center uppercase tracking-wider text-white">Diag Code Protocol FAQ</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="p-5 bg-[#0a0a14] border border-white/5 rounded-xl relative tech-bracket"
                  style={{ '--neon-color': secondaryNeon }}
                >
                  <h4 className="font-bold text-sm text-cyan-400 uppercase mb-2">Q// {faq.question}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2 mt-2">
                    A// {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Reservation HUD Module */}
        <section id="book" className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 border-t border-white/5">
          <div className="space-y-8 flex flex-col justify-center">
            <h3 className="text-3xl font-bold uppercase tracking-wider text-white">Neural Hub Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light border-l-2 border-purple-500/20 pl-4">
              For priority support, offline terminal sync codes, or custom corporate enterprise agreements, connect using the coordinates below.
            </p>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-slate-500 text-[9px] uppercase tracking-wider">COORDINATES</h4>
                  <p className="text-white font-bold">{address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-slate-500 text-[9px] uppercase tracking-wider">COMM LINK</h4>
                  <p className="text-white font-bold">{phone}</p>
                </div>
              </div>
              {contact?.email && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-slate-500 text-[9px] uppercase tracking-wider">SECURE INBOX</h4>
                    <p className="text-white font-bold">{contact.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-green-400">
                <div className="p-3 rounded-lg bg-green-950/30 border border-green-500/20 text-green-500">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-slate-500 text-[9px] uppercase tracking-wider text-green-500/60">WHATSAPP CHAT</h4>
                  <p className="font-bold">{whatsapp}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#0a0a14] border border-white/5 rounded-2xl relative tech-bracket" style={{ '--neon-color': primaryNeon }}>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6 text-white">Initialize Booking Request</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">GUEST IDENTITY</label>
                <input 
                  type="text" 
                  name="customerName"
                  required
                  placeholder="e.g. John Doe"
                  value={bookingForm.customerName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">INBOX ADDR</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="you@domain.com"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">DIAL DIGITS</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="+1 555-0199"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">DOCK DATE</label>
                  <input 
                    type="date" 
                    name="bookingDate"
                    required
                    value={bookingForm.bookingDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">DOCK TIME</label>
                  <input 
                    type="time" 
                    name="bookingTime"
                    required
                    value={bookingForm.bookingTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-bold">CHOOSE SUITE MODULE</label>
                <select 
                  name="service"
                  value={bookingForm.service}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/60 focus:border-cyan-500/50 focus:outline-none text-xs text-white dark:bg-slate-900"
                >
                  {services.map((s, i) => (
                    <option key={i} value={s.name}>{s.name} ({s.price})</option>
                  ))}
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full py-4 rounded-xl font-bold hover:scale-[1.01] transition duration-200 mt-2 shadow-lg disabled:opacity-50 text-xs text-black"
                style={{ backgroundColor: primaryNeon }}
              >
                {bookingLoading ? 'DOCKING IN PROGRESS...' : 'AUTHORIZE SUITE DOCKING'}
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-[10px] tracking-widest text-slate-600 border-t border-white/5">
          <p>© {new Date().getFullYear()} {businessName}. Neural Grid layout generated with Build It All.</p>
        </footer>
      </div>
    );
  };

  // ----------------------------------------------------
  // TEMPLATE 2: CLASSIC (Serif typography, clean lines, luxury)
  // ----------------------------------------------------
  const renderClassic = () => {
    return (
      <div style={{ backgroundColor: colors.bg, color: colors.text }} className="transition-colors duration-300 min-h-screen font-serif">
        {/* Navigation */}
        <header className="border-b border-gray-200/20 py-8 px-6 text-center">
          <h1 className="text-4xl font-semibold tracking-wide uppercase">{businessName}</h1>
          <div className="flex justify-center items-center space-x-8 mt-6 text-sm uppercase tracking-widest font-sans">
            <a href="#about" className="hover:opacity-75 transition">Our Story</a>
            <a href="#services" className="hover:opacity-75 transition">Services</a>
            <a href="#faqs" className="hover:opacity-75 transition">FAQ</a>
            <a href="#book" className="hover:opacity-75 transition font-semibold" style={{ color: colors.primary }}>Book Now</a>
            <button onClick={toggleThemeMode} className="p-1 rounded hover:bg-gray-500/10">
              {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto py-16 px-6 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="font-sans text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              Introducing {businessName}
            </p>
            <h2 className="text-4xl md:text-5xl font-normal leading-tight">
              {hero?.title || 'Classic & Timeless Quality'}
            </h2>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: colors.primary }} />
            <p className="text-lg italic opacity-80 font-light">
              "{hero?.subtitle || 'Exemplifying classic service and luxury standards.'}"
            </p>
          </div>
          
          <div className="rounded overflow-hidden shadow-xl h-[450px] bg-slate-900 border border-gray-500/10">
            <img 
              src={hero?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"} 
              alt="Business Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-500/5 px-6 border-t border-b border-gray-500/10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-light italic">{about?.title || 'Our Legacy'}</h3>
              <div className="w-12 h-0.5" style={{ backgroundColor: colors.primary }} />
              <p className="text-base opacity-80 leading-relaxed font-sans text-justify">
                {about?.story}
              </p>
            </div>
            <div className="border border-gray-500/20 p-2 rounded">
              <img 
                src={about?.imageUrl || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"} 
                alt="About Legacy"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-normal uppercase tracking-wider">Premium Selection</h3>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: colors.primary }} />
          </div>
          <div className="grid md:grid-cols-2 gap-8 font-sans">
            {services.map((svc, i) => (
              <div key={i} className="border border-gray-500/10 p-8 rounded shadow-sm hover:border-gray-500/30 transition flex justify-between gap-6" style={{ backgroundColor: colors.bg }}>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold tracking-tight">{svc.name}</h4>
                  <p className="text-sm opacity-70 leading-relaxed">{svc.description}</p>
                </div>
                <div className="text-right flex flex-col justify-between items-end min-w-[80px]">
                  <span className="font-semibold text-lg" style={{ color: colors.primary }}>{svc.price}</span>
                  {svc.duration && <span className="text-xs opacity-50 flex items-center gap-1"><Clock size={10} /> {svc.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="py-20 px-6 bg-gray-500/5 border-t border-b border-gray-500/10">
          <div className="max-w-4xl mx-auto space-y-12">
            <h3 className="text-3xl text-center uppercase tracking-wider font-light">Questions & Answers</h3>
            <div className="divide-y divide-gray-500/25">
              {faqs.map((faq, i) => (
                <div key={i} className="py-6 space-y-3">
                  <h4 className="text-lg font-semibold">{faq.question}</h4>
                  <p className="text-sm opacity-75 leading-relaxed font-sans" style={{ color: colors.cardText }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/Booking Form */}
        <section id="book" className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div className="border border-gray-500/20 p-8 rounded shadow-lg bg-opacity-40 font-sans" style={{ backgroundColor: colors.bg }}>
            <h3 className="text-2xl font-serif font-normal uppercase tracking-wide mb-6">Schedule Reservation</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Name</label>
                <input 
                  type="text" 
                  name="customerName"
                  required
                  value={bookingForm.customerName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none"
                  style={{ borderColor: colors.primary }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Date</label>
                  <input 
                    type="date" 
                    name="bookingDate"
                    required
                    value={bookingForm.bookingDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Time</label>
                  <input 
                    type="time" 
                    name="bookingTime"
                    required
                    value={bookingForm.bookingTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest opacity-60 mb-2">Choose offering</label>
                <select 
                  name="service"
                  value={bookingForm.service}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded border border-gray-500/20 bg-transparent focus:outline-none text-slate-800 dark:text-slate-100 dark:bg-slate-800"
                >
                  {services.map((s, i) => (
                    <option key={i} value={s.name}>{s.name} ({s.price})</option>
                  ))}
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full py-4 rounded uppercase tracking-widest font-bold transition duration-200 mt-2 shadow disabled:opacity-50"
                style={btnStyle}
              >
                {bookingLoading ? 'Requesting...' : 'Request Reservation'}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-8 flex flex-col justify-center">
            <h3 className="text-3xl font-normal uppercase tracking-wide">Contact Details</h3>
            <p className="opacity-80 font-sans leading-relaxed">For urgent queries, banquet events, or custom requirements, please dial or write to us directly.</p>
            
            <div className="space-y-4 font-sans text-sm">
              <div className="flex items-center gap-4">
                <MapPin size={18} style={{ color: colors.primary }} />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={18} style={{ color: colors.primary }} />
                <span>{phone}</span>
              </div>
              {contact?.email && (
                <div className="flex items-center gap-4">
                  <Mail size={18} style={{ color: colors.primary }} />
                  <span>{contact.email}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-green-500">
                <MessageSquare size={18} />
                <span>WhatsApp: {whatsapp}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-xs tracking-widest font-sans border-t border-gray-500/10">
          <p>© {new Date().getFullYear()} {businessName}. All Rights Reserved.</p>
        </footer>
      </div>
    );
  };

  // ----------------------------------------------------
  // TEMPLATE 3: MINIMALIST (Heavy spacing, extreme contrast, raw)
  // ----------------------------------------------------
  const renderMinimalist = () => {
    return (
      <div style={{ backgroundColor: colors.bg, color: colors.text }} className="transition-colors duration-300 min-h-screen font-sans tracking-tight">
        {/* Navigation */}
        <header className="max-w-5xl mx-auto py-12 px-6 flex justify-between items-center">
          <span className="text-xl font-bold uppercase tracking-wider">{businessName}</span>
          <div className="flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest">
            <a href="#services" className="hover:underline">Index</a>
            <a href="#book" className="hover:underline">Contact</a>
            <button onClick={toggleThemeMode} className="p-1 rounded">
              {themeMode === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto py-16 px-6 space-y-12">
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-none max-w-3xl">
            {hero?.title || 'Minimalistic Elegance.'}
          </h2>
          <p className="text-xl max-w-2xl font-light opacity-80 leading-relaxed">
            {hero?.subtitle}
          </p>
          <div className="pt-4">
            <a href="#book" className="px-6 py-3 border font-semibold hover:bg-white hover:text-black transition" style={{ borderColor: colors.text }}>
              {hero?.ctaText || 'Connect'}
            </a>
          </div>

          <div className="filter grayscale h-96 bg-neutral-900 overflow-hidden">
            <img 
              src={hero?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"} 
              alt="Business Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 border-t border-b border-gray-500/10">
          <div className="text-xs uppercase tracking-widest font-bold opacity-60">
            01 / Background
          </div>
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold">{about?.title || 'Overview'}</h3>
            <p className="text-lg font-light opacity-80 leading-relaxed whitespace-pre-line">
              {about?.story}
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="text-xs uppercase tracking-widest font-bold opacity-60">
            02 / Offerings
          </div>
          <div className="md:col-span-2 divide-y divide-gray-500/10">
            {services.map((svc, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                <div className="space-y-2 max-w-md">
                  <h4 className="text-xl font-bold">{svc.name}</h4>
                  <p className="text-sm opacity-70 leading-relaxed">{svc.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-lg">{svc.price}</span>
                  {svc.duration && <span className="text-xs opacity-50 block mt-1">{svc.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="py-24 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 border-t border-gray-500/10">
          <div className="text-xs uppercase tracking-widest font-bold opacity-60">
            03 / Info
          </div>
          <div className="md:col-span-2 space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-2">
                <h4 className="font-semibold text-lg">{faq.question}</h4>
                <p className="text-sm opacity-75 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact and Form */}
        <section id="book" className="py-24 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 border-t border-gray-500/10">
          <div className="text-xs uppercase tracking-widest font-bold opacity-60">
            04 / Booking
          </div>
          <div className="md:col-span-2 space-y-12">
            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    name="customerName"
                    required
                    placeholder="Your Name"
                    value={bookingForm.customerName}
                    onChange={handleFormChange}
                    className="w-full py-3 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Your Email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    className="w-full py-3 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="Your Phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    className="w-full py-3 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <select 
                    name="service"
                    value={bookingForm.service}
                    onChange={handleFormChange}
                    className="w-full py-3 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none text-slate-800 dark:text-slate-100 dark:bg-slate-900"
                  >
                    {services.map((s, i) => (
                      <option key={i} value={s.name}>{s.name} ({s.price})</option>
                    ))}
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Date</label>
                  <input 
                    type="date" 
                    name="bookingDate"
                    required
                    value={bookingForm.bookingDate}
                    onChange={handleFormChange}
                    className="w-full py-2 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-1">Time</label>
                  <input 
                    type="time" 
                    name="bookingTime"
                    required
                    value={bookingForm.bookingTime}
                    onChange={handleFormChange}
                    className="w-full py-2 border-b border-gray-500/20 bg-transparent focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={bookingLoading}
                  className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Submitting...' : 'Submit Booking'}
                </button>
              </div>
            </form>

            {/* Direct Contact info */}
            <div className="pt-8 border-t border-gray-500/10 grid grid-cols-2 gap-6 text-xs uppercase tracking-widest font-semibold">
              <div>
                <span className="opacity-55 block mb-2">Location</span>
                <span>{address}</span>
              </div>
              <div>
                <span className="opacity-55 block mb-2">Contact</span>
                <span className="block mb-1">P: {phone}</span>
                <span>WA: {whatsapp}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-[10px] tracking-widest opacity-50 border-t border-gray-500/10">
          <p>© {new Date().getFullYear()} {businessName}. Powered by Build It All.</p>
        </footer>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Target Site Contents */}
      {renderTemplateContent()}

      {/* Success Modal */}
      <AnimatePresence>
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-premium rounded-3xl p-8 max-w-md w-full text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <CheckCircle size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Booking Requested!</h3>
                <p className="text-sm text-slate-300">
                  Your appointment has been registered in our system. To confirm instantly and secure your spot, please click the button below to message us directly on WhatsApp.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <MessageSquare size={18} />
                  Confirm on WhatsApp
                </a>
                <button 
                  onClick={() => setBookingSuccess(false)}
                  className="w-full py-3 px-6 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition text-sm font-semibold"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
