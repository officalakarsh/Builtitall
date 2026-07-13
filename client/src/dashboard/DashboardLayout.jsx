import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RomeLogo from '../components/RomeLogo';
import { 
  LayoutDashboard, Globe, CalendarRange, BarChart3, 
  LogOut, UserCircle, Menu, X, Bot, Sparkles, Send
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  
  // Simulated AI Chat state
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am your Build It All AI Assistant. How can I help optimize your business sites today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [userName] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.name || 'Business Owner';
      } catch {
        // ignore
      }
    }
    return 'Business Owner';
  });

  const [userPlan] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.subscription?.plan || 'free';
      } catch {
        // ignore
      }
    }
    return 'free';
  });

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Websites', path: '/dashboard/sites', icon: Globe },
    { label: 'Bookings & Leads', path: '/dashboard/bookings', icon: CalendarRange },
    { label: 'Analytics Insights', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Profile & Billing', path: '/dashboard/profile', icon: UserCircle }
  ];

  const pageTitles = {
    '/dashboard': 'System Overview',
    '/dashboard/sites': 'AI Site Manager',
    '/dashboard/bookings': 'Bookings & Leads Queue',
    '/dashboard/analytics': 'Analytics Insights',
    '/dashboard/profile': 'Account & Subscription Settings'
  };

  const currentTitle = pageTitles[location.pathname] || 'Workspace';

  // AI response helper
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    // Formulate response matching business context
    let reply = 'I am scanning your active generation logs... Try choosing one of our design layouts (Modern, Classic, Minimalist) to optimize your conversion rate!';
    
    const normalizedText = text.toLowerCase();
    if (normalizedText.includes('seo') || normalizedText.includes('keywords')) {
      reply = 'Tip: Include localized key terms like "Best Sweet Box in Old Town" inside your business description. This forces the Gemini SEO generator to index your site higher!';
    } else if (normalizedText.includes('booking') || normalizedText.includes('whatsapp')) {
      reply = 'WhatsApp Booking tip: Double check that your WhatsApp phone contains the full country code (e.g. 91xxxxxxxxxx) so the auto-filled scheduling links open correctly.';
    } else if (normalizedText.includes('template') || normalizedText.includes('theme')) {
      reply = 'You can switch layout templates instantly under the Content Editor tab. Try the "Modern Glow" layout for sleek dark aesthetics.';
    } else if (normalizedText.includes('hello') || normalizedText.includes('hi')) {
      reply = 'Hello! I can assist in writing landing copy description prompts, generating key terms, or explaining metrics. What business area are we optimizing?';
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden relative font-sans">
      
      {/* Background spotlights & mesh */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] glow-orb-primary opacity-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] glow-orb-secondary opacity-10 pointer-events-none" />

      {/* 1. LEFT SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass border-r border-white/5 p-6 flex flex-col justify-between
        transition-transform duration-300 md:translate-x-0 md:static md:h-screen shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <RomeLogo size="md" />
            <div>
              <span className="font-extrabold text-base bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-display">Build It All</span>
              <span className="text-[9px] block uppercase tracking-widest text-indigo-400 font-bold">AI Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition duration-200
                    ${isActive 
                      ? 'bg-white/5 border-gradient-glow text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'}
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block & Logout */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400 uppercase">
              {userName.charAt(0)}
            </div>
            <div className="truncate max-w-[130px]">
              <h4 className="text-xs font-semibold text-white truncate">{userName}</h4>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{planStatusDisplay(userPlan)}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-transparent rounded-xl transition duration-200"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-10 z-20 bg-black/10 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="md:hidden p-2 hover:bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-base md:text-lg font-bold text-white font-display">{currentTitle}</h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Assistant Toggle Button */}
            <button
              onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border ${
                isAiPanelOpen 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20' 
                  : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Bot size={15} className="text-purple-400" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <Sparkles size={12} className="text-pink-400 animate-pulse" />
            </button>
          </div>
        </header>

        {/* Content body wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 w-full no-scrollbar">
          {children}
        </main>
      </div>

      {/* 3. RIGHT COLLAPSIBLE AI ASSISTANT DRAWER */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-80 glass border-l border-white/5 flex flex-col justify-between
        transition-transform duration-300 shadow-2xl h-screen shrink-0
        ${isAiPanelOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-purple-400" />
            <h3 className="font-bold text-sm text-white font-display">AI Assistant Companion</h3>
          </div>
          <button 
            onClick={() => setIsAiPanelOpen(false)}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conversation Streams */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none' 
                  : 'bg-slate-900 text-slate-200 border border-white/5 rounded-bl-none font-light'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-white/5 rounded-2xl rounded-bl-none p-3 text-xs text-slate-400 flex items-center gap-1.5 animate-pulse">
                <Sparkles size={12} className="text-purple-400 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="p-4 border-t border-white/5 bg-black/[0.02] space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quick suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            <button 
              onClick={() => handleSendMessage('Suggest SEO optimization tips')}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              SEO Tips
            </button>
            <button 
              onClick={() => handleSendMessage('How do I customize themes?')}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-[10px] rounded-lg text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              Theme customization
            </button>
          </div>
        </div>

        {/* Chat Inputs box */}
        <div className="p-4 border-t border-white/5 bg-black/40">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition shadow-md"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </aside>

    </div>
  );
}

const planStatusDisplay = (plan) => {
  if (plan === 'pro') return 'Pro Member';
  if (plan === 'starter') return 'Starter Member';
  return 'Free Tier Account';
};
