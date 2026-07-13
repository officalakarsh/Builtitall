import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RomeLogo from '../components/RomeLogo';
import { 
  ArrowRight, Bot, Zap, Shield, Sparkles, Smartphone, 
  BarChart, Globe, Store, Coffee, Scissors, Dumbbell, 
  MessageCircle, Star, HelpCircle, Check, ChevronDown 
} from 'lucide-react';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(0);
  const [activeTemplateTab, setActiveTemplateTab] = useState('modern');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Twinkling Starfield Canvas
  useEffect(() => {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    const starCount = 140;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.6,
        alpha: Math.random(),
        speed: 0.01 + Math.random() * 0.04,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.85 ? '#a855f7' : (Math.random() > 0.6 ? '#60a5fa' : '#ffffff')
      });
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        star.alpha += star.speed * star.direction;
        if (star.alpha > 1) {
          star.alpha = 1;
          star.direction = -1;
        } else if (star.alpha < 0.05) {
          star.alpha = 0.05;
          star.direction = 1;
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const categories = [
    { name: 'Hotels', icon: Coffee, desc: 'Luxury suite structures, amenities cards, custom checkout links.', color: 'from-blue-500 to-cyan-500' },
    { name: 'Restaurants', icon: Store, desc: 'Dynamic menu listings, chefs highlights, reservation calendars.', color: 'from-orange-500 to-amber-500' },
    { name: 'Sweet Shops', icon: Sparkles, desc: 'Festive box showcases, sweet hampers, pricing list tags.', color: 'from-pink-500 to-rose-500' },
    { name: 'Salons & Spas', icon: Scissors, desc: 'Specialist service menus, team bio lists, scheduler triggers.', color: 'from-purple-500 to-indigo-500' },
    { name: 'Gyms', icon: Dumbbell, desc: 'Tier memberships cards, personal trainers logs, schedule sheets.', color: 'from-emerald-500 to-teal-500' }
  ];

  const steps = [
    { title: 'Describe Concept', desc: 'Input your shop name, niche category, and target location into our AI prompt box.' },
    { title: 'AI Synthesis', desc: 'Gemini aggregates layout copy, theme palettes, and optimal keywords in seconds.' },
    { title: 'Visual Review', desc: 'Review Modern, Classic, or Minimalist themes with color selectors.' },
    { title: 'Publish Live', desc: 'Launch your website immediately with built-in bookings and automated WhatsApp confirmation scripts.' }
  ];

  const templatePreviews = {
    modern: {
      title: 'Modern Glow Layout',
      desc: 'Featuring bold headers, grid gradients, neon badges, and cards with hover scaling. Best for salons, luxury bars, and fitness centers.',
      img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    },
    classic: {
      title: 'Classic Heritage Theme',
      desc: 'Elegant serifs typography, clean boxed sections, warm earth tones, and traditional reservation tables. Perfect for restaurants and hotels.',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
    },
    minimalist: {
      title: 'Minimal Slate Style',
      desc: 'Strict monochrome styling, fine outlines, spacious layouts, and clean schedules logs. Ideal for sweet shops and boutique cafes.',
      img: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80'
    },
    hightech: {
      title: 'High-Tech Futuristic Layout',
      desc: 'Sci-fi monospace HUD dashboard layouts, live digital capsule grids status, neon scanning lines, and automated concierge parameters. Tailored for hotels, capsule lodgings, and visualization decks.',
      img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
    }
  };

  const faqData = [
    { q: 'How does the AI website builder work?', a: 'By entering basic business metadata (name, address, category, phone), our custom service uses the Gemini API to draft optimized website text, structural layouts, custom menus, and meta tags in seconds.' },
    { q: 'Do I need a separate WhatsApp API account?', a: 'No. The platform generates optimized deep links mapping your client bookings details directly to standard WhatsApp numbers for zero-cost bookings confirm operations.' },
    { q: 'How are usage limits calculated?', a: 'Limits depend on your active subscription plan. Free allows 1 site, Starter up to 5 sites, and Pro grants unlimited website deployments.' },
    { q: 'Can I customize the generated text and colors?', a: 'Yes. The built-in Site Editor contains tabs to modify text copy, add FAQs, insert services, update contact info, and select themes.' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative font-sans select-none">
      
      {/* 1. HERO SECTION */}
      <header className="relative min-h-screen flex flex-col justify-between z-10 overflow-hidden bg-black">
        {/* Galaxy twinklers */}
        <canvas id="galaxy-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        
        {/* Spotlight light mask */}
        <div 
          className="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0 glow-orb-accent opacity-[0.08]"
          style={{
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
            position: 'fixed'
          }}
        />

        {/* Rotating Solar Orbits */}
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] flex items-center justify-center opacity-[0.15] pointer-events-none z-0 scale-90 md:scale-110">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full border border-dashed border-indigo-500/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_15px_#818cf8]" />
          </motion.div>
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-pink-500/25"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute bottom-0 right-1/4 w-3.5 h-3.5 bg-pink-400 rounded-full shadow-[0_0_12px_#f472b6]" />
          </motion.div>
          <motion.div
            className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-cyan-500/35"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
          </motion.div>
        </div>

        {/* Header Navbar */}
        <nav className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center space-x-3">
            <RomeLogo size="lg" />
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-display">Build It All</span>
              <span className="text-[10px] block uppercase tracking-widest text-indigo-400 font-bold leading-none">AI Factory</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing</Link>
            <Link to="/login" className="text-sm font-semibold hover:text-white transition">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-slate-200 transition duration-200 shadow-md">
              Launch Platform
            </Link>
          </div>
        </nav>

        {/* Hero Body */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-20 text-center space-y-8 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 text-[11px] font-bold uppercase tracking-widest animate-pulse">
              <Bot size={13} className="text-cyan-400" />
              <span>Next-Gen Agentic Website Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-white font-display">
              Build Premium Local Sites With <span className="text-gradient-electric text-distort">Agentic AI</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Auto-generate optimized website contents, booking slots tables, meta tags, and layouts instantly. Integrated with automated WhatsApp message triggers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link to="/register" className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] transition duration-300 shadow-lg shadow-indigo-600/20 flex items-center gap-2">
              Generate Site Now
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 transition duration-300">
              Access Workspace
            </Link>
          </motion.div>
        </div>

        {/* Bottom indicator */}
        <div className="w-full text-center pb-6 text-slate-500 text-xs tracking-widest uppercase relative z-10">
          Scroll Down to Explore
        </div>
      </header>

      {/* 2. TRUSTED BY SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-y border-white/5 bg-black/40">
        <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">Secured & Powered By Industry Standards</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-65 text-slate-400 font-bold text-sm tracking-wider">
          <div className="flex items-center gap-1.5"><Bot size={16} className="text-indigo-400" /> Gemini Generative</div>
          <div className="flex items-center gap-1.5"><Shield size={16} className="text-blue-400" /> Stripe Billing</div>
          <div className="flex items-center gap-1.5"><Zap size={16} className="text-amber-400" /> Vercel Dynamic</div>
          <div className="flex items-center gap-1.5"><MessageCircle size={16} className="text-green-400" /> WhatsApp confirm</div>
          <div className="flex items-center gap-1.5"><Globe size={16} className="text-pink-400" /> MERN Factory</div>
        </div>
      </section>

      {/* 3. CORE ECOSYSTEM FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Platform Core</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">Aesthetic Power Meets AI Speed</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass rounded-3xl p-8 space-y-4 glass-hover">
            <Zap className="text-blue-400 shadow-sm" size={32} />
            <h3 className="font-bold text-xl text-white">Gemini Content generation</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Automatically draft full layouts, localized details, specialized menus, lists, and headings matching your category metadata.
            </p>
          </div>
          <div className="glass rounded-3xl p-8 space-y-4 glass-hover">
            <MessageCircle className="text-purple-400" size={32} />
            <h3 className="font-bold text-xl text-white">WhatsApp Bookings Linker</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Submit booking calendars instantly. Information is saved to database queues and linked to prompt message streams on WhatsApp.
            </p>
          </div>
          <div className="glass rounded-3xl p-8 space-y-4 glass-hover">
            <BarChart className="text-cyan-400" size={32} />
            <h3 className="font-bold text-xl text-white">Timeline Recharts Graphs</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Analyze booking charts, page views counters, conversion metrics, and category distributions through interactive layouts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. AI WEBSITE GENERATION FLOW */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Process Stepper</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">How It Generates</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition duration-300 cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-slate-900/60 border-purple-500/50 shadow-md' 
                    : 'bg-black/20 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    activeStep === idx ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base">{step.title}</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden h-[360px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4 p-4 max-w-sm"
              >
                <div className="w-16 h-16 bg-purple-950/40 rounded-2xl flex items-center justify-center mx-auto text-purple-400 border border-purple-800/40">
                  {activeStep === 0 && <Bot size={28} />}
                  {activeStep === 1 && <Sparkles size={28} />}
                  {activeStep === 2 && <Smartphone size={28} />}
                  {activeStep === 3 && <Zap size={28} />}
                </div>
                <h3 className="text-xl font-bold text-white">{steps[activeStep].title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {activeStep === 0 && 'Our prompts translate short words into complete layout schemas.'}
                  {activeStep === 1 && 'AI drafts specialized text, layouts configurations, and themes color mappings.'}
                  {activeStep === 2 && 'Preview Modern, Classic, or Minimalist themes before saving.'}
                  {activeStep === 3 && 'Clicking generate schedules live slots directly to MongoDB and WhatsApp.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. TEMPLATES SHOWCASE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Layout Designs</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">Crafted Template Options</h2>
        </div>

        <div className="flex justify-center gap-3">
          {['modern', 'classic', 'minimalist', 'hightech'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTemplateTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition duration-200 capitalize ${
                activeTemplateTab === tab 
                  ? 'bg-white text-black shadow-md' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800/80 hover:text-white'
              }`}
            >
              {tab} Theme
            </button>
          ))}
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded-full text-[10px] text-cyan-300 font-bold uppercase tracking-widest">
              Design Layout
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              {templatePreviews[activeTemplateTab].title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              {templatePreviews[activeTemplateTab].desc}
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Responsive layouts grid</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Embedded schedules calendar</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-cyan-400" /> Customizable color schemes</li>
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-video relative border border-white/5 bg-slate-950">
            <img 
              src={templatePreviews[activeTemplateTab].img} 
              alt={templatePreviews[activeTemplateTab].title} 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      {/* 6. BUSINESS CATEGORIES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Niches</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">Specialized Layouts</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-[230px] glass-hover"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-white text-lg font-display">{cat.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{cat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Subscription Tiers</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">Flexible Plan Options</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col justify-between h-[520px] relative">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Free Plan</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for exploring local AI builders.</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-xs text-slate-500 ml-1">/ forever</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 1 Generated Website</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 10 Bookings / month</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Standard templates & themes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Basic dashboard analytics</li>
              </ul>
            </div>
            <Link to="/register" className="w-full py-3 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition duration-200 mt-8">
              Get Started
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="glass rounded-3xl p-8 border border-purple-500/40 bg-slate-950/80 flex flex-col justify-between h-[520px] relative shadow-lg shadow-purple-500/5">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Most Popular
            </span>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter Plan</h3>
                <p className="text-xs text-slate-400 mt-1">For active shop operators.</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$19</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 5 Generated Websites</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 100 Bookings / month</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Access premium layout options</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Advanced analytics graphs</li>
              </ul>
            </div>
            <Link to="/pricing" className="w-full py-3 text-center bg-white text-black hover:bg-slate-200 font-bold rounded-xl text-xs transition duration-200 mt-8">
              Upgrade Now
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col justify-between h-[520px] relative">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Pro Plan</h3>
                <p className="text-xs text-slate-500 mt-1">For multi-franchises & builders.</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$49</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300 border-t border-white/5 pt-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Websites</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Bookings / month</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> All premium features</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Priority WhatsApp support</li>
              </ul>
            </div>
            <Link to="/pricing" className="w-full py-3 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition duration-200 mt-8">
              Go Pro
            </Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Reviews</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">What Owners Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 glow-orb-secondary opacity-10 filter blur-xl pointer-events-none" />
            <div className="flex gap-1 text-purple-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              "We generated our hotel website in 10 seconds. The WhatsApp booking deep link works beautifully. Customers schedule rooms easily and message us automatically."
            </p>
            <div className="border-t border-white/5 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">RK</div>
              <div>
                <h4 className="font-bold text-xs text-white">Rahul Kapoor</h4>
                <p className="text-[10px] text-slate-500">Royal Inn Resort</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 glow-orb-secondary opacity-10 filter blur-xl pointer-events-none" />
            <div className="flex gap-1 text-purple-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              "Our gym subscription bookings skyrocketed. The dashboard analytics graphs give us real-time logs on views vs schedules. Outstanding AI generator tools."
            </p>
            <div className="border-t border-white/5 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">MS</div>
              <div>
                <h4 className="font-bold text-xs text-white">Meera Sen</h4>
                <p className="text-[10px] text-slate-500">Peak Fitness Gym</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 glow-orb-secondary opacity-10 filter blur-xl pointer-events-none" />
            <div className="flex gap-1 text-purple-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              "The custom content generated by the Gemini engine was shockingly good. It structured our sweet listings and FAQ menus perfectly with local styling guides."
            </p>
            <div className="border-t border-white/5 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs">AG</div>
              <div>
                <h4 className="font-bold text-xs text-white">Anil Gupta</h4>
                <p className="text-[10px] text-slate-500">Gupta Sweets & Bakers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-white/5 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">Questions</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-display">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div 
                key={index}
                className="glass rounded-2xl border border-white/5 overflow-hidden transition"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center font-bold text-sm text-white hover:bg-white/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-purple-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="p-6 pt-0 text-slate-400 text-xs leading-relaxed font-light border-t border-white/5 bg-white/[0.01]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FOOTER SECTION */}
      <footer className="relative z-10 border-t border-white/5 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-400 text-xs">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <RomeLogo size="lg" />
              <span className="font-extrabold text-lg tracking-tight text-white font-display">Build It All</span>
            </div>
            <p className="text-slate-500 font-light leading-relaxed">
              Leading AI multi-tenant website generation factory. Launch business websites with localized content and WhatsApp booking logs instantly.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">Platform</h4>
            <ul className="space-y-2 font-light">
              <li><Link to="/register" className="hover:text-white transition">Builder Wizard</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Tiers Pricing</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Admin Portal</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">Ecosystem</h4>
            <ul className="space-y-2 font-light">
              <li><span className="text-slate-500">Express Backend</span></li>
              <li><span className="text-slate-500">Mongoose Database</span></li>
              <li><span className="text-slate-500">Gemini Generative API</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs">Security</h4>
            <ul className="space-y-2 font-light text-slate-500">
              <li>Helmet Guard Protection</li>
              <li>Rate Limits Enforced</li>
              <li>Secure httpOnly Cookies</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-6 text-center text-slate-600 text-[10px]">
          <p>© {new Date().getFullYear()} Build It All AI Platform. All Rights Reserved. Dark Galaxy Theme Built to Agentic Standards.</p>
        </div>
      </footer>
    </div>
  );
}
