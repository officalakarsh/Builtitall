import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, Eye, ArrowLeft, Plus, Trash2, Layout, FileCode2, Sliders } from 'lucide-react';
import { api } from '../services/api';
import TemplateRenderer from '../components/TemplateRenderer';
import OrbitPreloader from '../components/OrbitPreloader';

export default function SiteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, seo, design, preview
  const [business, setBusiness] = useState(null);
  
  // Custom regeneration prompt
  const [regenPrompt, setRegenPrompt] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await api.get(`/businesses/${id}`);
        if (active && data.success) {
          setBusiness(data.data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          alert('Error fetching business website details.');
          navigate('/dashboard/sites');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id, navigate]);

  // Handle standard field changes
  const handleFieldChange = (section, field, value) => {
    setBusiness(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          [field]: value
        }
      }
    }));
  };

  // Handle SEO changes
  const handleSeoChange = (field, value) => {
    setBusiness(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  // Handle Theme changes
  const handleThemeChange = (field, value) => {
    setBusiness(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };

  // Handle general fields (Name, Slug, Address, Phone, WhatsApp, Template)
  const handleGeneralChange = (field, value) => {
    setBusiness(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update Services Array
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...business.content.services];
    updatedServices[index][field] = value;
    setBusiness(prev => ({
      ...prev,
      content: { ...prev.content, services: updatedServices }
    }));
  };

  const addService = () => {
    setBusiness(prev => ({
      ...prev,
      content: {
        ...prev.content,
        services: [
          ...prev.content.services,
          { name: 'New Service', description: 'Brief service description', price: '$0', duration: '30 mins' }
        ]
      }
    }));
  };

  const removeService = (index) => {
    const updatedServices = business.content.services.filter((_, i) => i !== index);
    setBusiness(prev => ({
      ...prev,
      content: { ...prev.content, services: updatedServices }
    }));
  };

  // Update FAQs Array
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...business.content.faqs];
    updatedFaqs[index][field] = value;
    setBusiness(prev => ({
      ...prev,
      content: { ...prev.content, faqs: updatedFaqs }
    }));
  };

  const addFaq = () => {
    setBusiness(prev => ({
      ...prev,
      content: {
        ...prev.content,
        faqs: [
          ...prev.content.faqs,
          { question: 'New Question?', answer: 'Detailed response goes here.' }
        ]
      }
    }));
  };

  const removeFaq = (index) => {
    const updatedFaqs = business.content.faqs.filter((_, i) => i !== index);
    setBusiness(prev => ({
      ...prev,
      content: { ...prev.content, faqs: updatedFaqs }
    }));
  };

  // Save Website Changes to DB
  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await api.put(`/businesses/${id}`, business);
      if (data.success) {
        setBusiness(data.data);
        alert('Website details saved successfully!');
      }
    } catch (err) {
      alert(err.message || 'Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  // Trigger Gemini AI regeneration
  const handleRegenerate = async () => {
    if (!window.confirm('This will completely rewrite the website sections and color themes using AI based on your instructions. Continue?')) {
      return;
    }
    setRegenerating(true);
    try {
      const data = await api.post(`/businesses/${id}/regenerate`, { description: regenPrompt });
      if (data.success) {
        setBusiness(data.data);
        setRegenPrompt('');
        alert('AI Content regenerated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Error regenerating AI website.');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading website customizer...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'content', label: 'Edit Content', icon: Layout },
    { id: 'seo', label: 'SEO Config', icon: FileCode2 },
    { id: 'design', label: 'Design Palette', icon: Sliders },
    { id: 'preview', label: 'Visual Preview', icon: Eye }
  ];

  return (
    <div className="space-y-8 relative">
      {/* Visual Regeneration loader overlay */}
      <AnimatePresence>
        {regenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium rounded-3xl p-8 max-w-lg w-full text-center"
            >
              <OrbitPreloader />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link to="/dashboard/sites" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-wider mb-2">
            <ArrowLeft size={14} />
            Back to sites
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Manage: {business.businessName}</span>
          </h1>
          <p className="text-xs text-slate-400">Category: <span className="uppercase text-purple-400 font-bold">{business.category}</span> | Slug Path: <span className="font-mono text-cyan-400">/site/{business.slug}</span></p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a 
            href={`/site/${business.slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold border border-white/5 flex items-center gap-2 transition"
          >
            <Eye size={16} />
            <span>Open Live Site</span>
          </a>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/10 flex items-center gap-2 hover:scale-[1.01] transition"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar Panel */}
        <div className="glass rounded-3xl border border-white/5 p-4 space-y-4">
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition duration-200 whitespace-nowrap lg:w-full
                    ${isActive 
                      ? 'bg-white/5 border border-white/10 text-purple-400 shadow' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Prompt AI regeneration Widget */}
          <div className="border-t border-white/5 pt-4 space-y-3 hidden lg:block">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <RefreshCw size={12} className="text-pink-400" />
              AI Content Overhaul
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">Modify prompts below to regenerate theme layout, keywords and copy.</p>
            <textarea
              rows="3"
              placeholder="e.g. Focus on organic sweets, premium suites, or add 10% holiday discount to descriptions..."
              value={regenPrompt}
              onChange={(e) => setRegenPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
            />
            <button
              onClick={handleRegenerate}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500 hover:text-white transition duration-200"
            >
              Regenerate Content
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body panel */}
        <div className="lg:col-span-3 glass rounded-3xl border border-white/5 p-8">
          {activeTab === 'content' && (
            <div className="space-y-8">
              {/* Hero edit form */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Hero Section</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Headline Title</label>
                    <input
                      type="text"
                      value={business.content.hero?.title || ''}
                      onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subheadline / Caption</label>
                    <textarea
                      rows="2"
                      value={business.content.hero?.subtitle || ''}
                      onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CTA Button Text</label>
                      <input
                        type="text"
                        value={business.content.hero?.ctaText || ''}
                        onChange={(e) => handleFieldChange('hero', 'ctaText', e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hero Image URL</label>
                      <input
                        type="text"
                        value={business.content.hero?.imageUrl || ''}
                        onChange={(e) => handleFieldChange('hero', 'imageUrl', e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About section edit form */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">About Section</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Story Title</label>
                    <input
                      type="text"
                      value={business.content.about?.title || ''}
                      onChange={(e) => handleFieldChange('about', 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Story / Detailed History</label>
                    <textarea
                      rows="4"
                      value={business.content.about?.story || ''}
                      onChange={(e) => handleFieldChange('about', 'story', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">About Image URL</label>
                    <input
                      type="text"
                      value={business.content.about?.imageUrl || ''}
                      onChange={(e) => handleFieldChange('about', 'imageUrl', e.target.value)}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Services section array customizer */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-lg font-bold text-white">Services & Products</h3>
                  <button 
                    onClick={addService}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus size={12} /> Add Offering
                  </button>
                </div>
                <div className="space-y-6">
                  {business.content.services.map((svc, index) => (
                    <div key={index} className="p-4 bg-black/40/60 border border-white/5 rounded-2xl relative space-y-3">
                      <button 
                        onClick={() => removeService(index)}
                        className="absolute top-4 right-4 text-pink-400 hover:text-pink-300 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-2 gap-4 pr-8">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</label>
                          <input
                            type="text"
                            value={svc.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</label>
                            <input
                              type="text"
                              value={svc.price}
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</label>
                            <input
                              type="text"
                              value={svc.duration || ''}
                              onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                              className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 pr-8">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                        <input
                          type="text"
                          value={svc.description}
                          onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs accordion customization */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                  <button 
                    onClick={addFaq}
                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus size={12} /> Add FAQ
                  </button>
                </div>
                <div className="space-y-6">
                  {business.content.faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-black/40/60 border border-white/5 rounded-2xl relative space-y-3">
                      <button 
                        onClick={() => removeFaq(index)}
                        className="absolute top-4 right-4 text-pink-400 hover:text-pink-300 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-1.5 pr-8">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                          className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5 pr-8">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Answer</label>
                        <textarea
                          rows="2"
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                          className="w-full px-3 py-2 bg-black/60 border border-white/5 rounded-xl text-xs focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">AI Search Engine Optimization</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Page Title</label>
                <input
                  type="text"
                  value={business.seo?.title || ''}
                  onChange={(e) => handleSeoChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Description</label>
                <textarea
                  rows="3"
                  value={business.seo?.metaDescription || ''}
                  onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={business.seo?.keywords?.join(', ') || ''}
                  onChange={(e) => handleSeoChange('keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Social sharing (Open Graph)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">OG Share Title</label>
                    <input
                      type="text"
                      value={business.seo?.openGraph?.title || ''}
                      onChange={(e) => {
                        const og = { ...business.seo.openGraph, title: e.target.value };
                        handleSeoChange('openGraph', og);
                      }}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">OG Share Image URL</label>
                    <input
                      type="text"
                      value={business.seo?.openGraph?.image || ''}
                      onChange={(e) => {
                        const og = { ...business.seo.openGraph, image: e.target.value };
                        handleSeoChange('openGraph', og);
                      }}
                      className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-sm focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Layout & Visual Design</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Layout Template</label>
                <div className="grid grid-cols-4 gap-2">
                  {['modern', 'classic', 'minimalist', 'hightech'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleGeneralChange('template', t)}
                      className={`py-3.5 rounded-xl text-[10px] uppercase tracking-wider font-bold border transition
                        ${business.template === t 
                          ? 'bg-purple-500/10 border-purple-500 text-white shadow' 
                          : 'border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'}
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color hex inputs */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">Business Theme HEX Colors</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Primary Accent Color</span>
                      <span className="font-mono text-[10px]">{business.theme?.primaryColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={business.theme?.primaryColor || '#3B82F6'}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        className="w-10 h-10 border border-white/10 rounded-xl bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={business.theme?.primaryColor || '#3B82F6'}
                        onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                        className="flex-1 px-4 bg-black/40 border border-white/5 rounded-xl text-xs uppercase font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Secondary Accent Color</span>
                      <span className="font-mono text-[10px]">{business.theme?.secondaryColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={business.theme?.secondaryColor || '#10B981'}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        className="w-10 h-10 border border-white/10 rounded-xl bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={business.theme?.secondaryColor || '#10B981'}
                        onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                        className="flex-1 px-4 bg-black/40 border border-white/5 rounded-xl text-xs uppercase font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Background Color</span>
                      <span className="font-mono text-[10px]">{business.theme?.backgroundColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={business.theme?.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 border border-white/10 rounded-xl bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={business.theme?.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                        className="flex-1 px-4 bg-black/40 border border-white/5 rounded-xl text-xs uppercase font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Base Text Color</span>
                      <span className="font-mono text-[10px]">{business.theme?.textColor}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={business.theme?.textColor || '#1F2937'}
                        onChange={(e) => handleThemeChange('textColor', e.target.value)}
                        className="w-10 h-10 border border-white/10 rounded-xl bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={business.theme?.textColor || '#1F2937'}
                        onChange={(e) => handleThemeChange('textColor', e.target.value)}
                        className="flex-1 px-4 bg-black/40 border border-white/5 rounded-xl text-xs uppercase font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-lg font-bold text-white">Visual Layout Preview</h3>
                <span className="text-xs text-slate-500 font-mono">Dynamic client preview</span>
              </div>
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40/40">
                {/* Renders the site directly using template render configurations in preview mode */}
                <TemplateRenderer business={business} isPreview={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
