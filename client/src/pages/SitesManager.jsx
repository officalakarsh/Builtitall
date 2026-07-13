import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Plus, Phone, MapPin, Scissors, Dumbbell, Coffee, Store, Sparkles, ArrowRight, Eye, Pencil, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import OrbitPreloader from '../components/OrbitPreloader';
import confetti from 'canvas-confetti';

export default function SitesManager() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successSite, setSuccessSite] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'hotel',
    address: '',
    phone: '',
    whatsapp: '',
    description: '',
    template: 'modern'
  });

  const fetchSites = async () => {
    try {
      const data = await api.get('/businesses');
      if (data.success) {
        setSites(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await api.get('/businesses');
        if (active && data.success) {
          setSites(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const data = await api.post('/businesses', formData);
      if (data.success) {
        setSuccessSite(data.data);
        fetchSites();
        
        // Trigger success confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert(err.message || 'Error generating AI website.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this website? This action is irreversible.')) {
      return;
    }
    try {
      const data = await api.delete(`/businesses/${id}`);
      if (data.success) {
        fetchSites();
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting website.');
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'hotel': return Coffee;
      case 'restaurant': return Store;
      case 'sweet-shop': return Sparkles;
      case 'salon': return Scissors;
      case 'gym': return Dumbbell;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Websites</h1>
          <p className="text-sm text-slate-400">Launch and organize your multi-tenant local business sites.</p>
        </div>
        <button 
          onClick={() => {
            setShowWizard(true);
            setSuccessSite(null);
          }}
          className="px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 flex items-center gap-2 hover:scale-[1.01] transition"
        >
          <Plus size={16} />
          <span>Launch AI Site</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <span className="w-7 h-7 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Retrieving your websites...</span>
        </div>
      ) : sites.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => {
            const Icon = getCategoryIcon(site.category);
            return (
              <motion.div 
                key={site._id}
                layout
                className="glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between h-[300px] hover:border-white/10 transition duration-300 relative group overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Category Pill and Visual indicator */}
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 flex items-center gap-1.5 border border-white/5">
                      <Icon size={12} className="text-purple-400" />
                      {site.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                      {site.views || 0} views
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="font-extrabold text-white text-xl truncate mb-1">{site.businessName}</h3>
                    <p className="text-xs text-slate-400 font-mono truncate">builditall/site/{site.slug}</p>
                  </div>

                  {/* Business Details info */}
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-slate-500" />
                      <span className="truncate">{site.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-500" />
                      <span>{site.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Operations links */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <a 
                    href={`/site/${site.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-2 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition flex items-center gap-1"
                  >
                    <Eye size={12} />
                    View Live
                  </a>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/dashboard/sites/${site._id}`}
                      className="p-2 bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
                      title="Edit website details"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(site._id)}
                      className="p-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white rounded-xl transition"
                      title="Delete website"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 max-w-xl mx-auto space-y-6">
          <Globe className="text-slate-600 mx-auto" size={48} />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No websites generated yet</h3>
            <p className="text-sm text-slate-400">
              Input business descriptors, select target templates, and generate customized, high-converting websites in seconds.
            </p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-md inline-flex items-center gap-2"
          >
            Launch Builder Wizard
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Creation Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative border border-white/10 shadow-2xl"
            >
              {/* If generating content, show OrbitPreloader */}
              {generating ? (
                <div className="py-10">
                  <OrbitPreloader />
                </div>
              ) : successSite ? (
                /* Success Screen */
                <div className="text-center space-y-6 py-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <Sparkles size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Website Generated!</h3>
                    <p className="text-sm text-slate-300">
                      Our Gemini integration has successfully constructed the copy, colors, and metadata structure for <span className="font-bold text-purple-400">{successSite.businessName}</span>.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-left text-xs font-mono text-slate-400">
                    <p>🌐 Slug: /site/{successSite.slug}</p>
                    <p>🎨 Palette: {successSite.theme.primaryColor} / {successSite.theme.secondaryColor}</p>
                    <p>📈 Keywords: {successSite.seo.keywords.slice(0, 3).join(', ')}</p>
                  </div>
                  
                  <div className="flex gap-4 pt-2">
                    <a 
                      href={`/site/${successSite.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl text-center shadow-md transition"
                    >
                      View Live Website
                    </a>
                    <Link
                      to={`/dashboard/sites/${successSite._id}`}
                      onClick={() => setShowWizard(false)}
                      className="flex-1 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm rounded-xl text-center transition"
                    >
                      Customize Content
                    </Link>
                  </div>
                </div>
              ) : (
                /* Generator Form */
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div>
                      <h2 className="text-xl font-extrabold text-white">New AI Site Generator</h2>
                      <p className="text-xs text-slate-400">Provide business parameters to initialize generation.</p>
                    </div>
                    <button 
                      onClick={() => setShowWizard(false)}
                      className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          required
                          placeholder="e.g. Royal Palace Hotel"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm text-white focus:outline-none"
                        >
                          <option value="hotel">Hotel</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="sweet-shop">Sweet Shop</option>
                          <option value="salon">Salon & Spa</option>
                          <option value="gym">Gym / Fitness Center</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          required
                          placeholder="e.g. +1 555-0199"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Support</label>
                        <input
                          type="text"
                          name="whatsapp"
                          required
                          placeholder="e.g. 919876543210"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        placeholder="e.g. 102 Luxury Ave, Downtown"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose Template Style</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['modern', 'classic', 'minimalist', 'hightech'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, template: t })}
                            className={`py-3 rounded-xl text-[10px] uppercase tracking-wider font-bold border transition
                              ${formData.template === t 
                                ? 'bg-purple-500/10 border-purple-500 text-white' 
                                : 'border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'}
                            `}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description / Keywords</label>
                      <textarea
                        name="description"
                        rows="3"
                        placeholder="Describe services, special offers, core brand history..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:scale-[1.01] transition shadow-md mt-2"
                    >
                      🚀 Synthesize AI Website
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
