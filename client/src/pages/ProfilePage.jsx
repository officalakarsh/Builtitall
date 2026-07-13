import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [websitesCount, setWebsitesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfileAndStats = async () => {
      try {
        setLoading(true);
        // Fetch current user details
        const authData = await api.get('/auth/me');
        if (authData.success && authData.user) {
          setProfile(authData.user);
          localStorage.setItem('user', JSON.stringify(authData.user));
        }

        // Fetch businesses list to calculate usage count
        const bizData = await api.get('/businesses');
        const count = bizData.data ? bizData.data.length : (Array.isArray(bizData) ? bizData.length : 0);
        setWebsitesCount(count);
      } catch (err) {
        console.error(err);
        setError('Failed to load user profile statistics.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  const user = profile || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  
  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
        <p className="text-red-400 font-semibold">Please log in to view your profile dashboard.</p>
        <button 
          onClick={() => navigate('/auth')} 
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const plan = user.subscription?.plan || 'free';
  const planStatus = user.subscription?.status || 'active';
  const periodEnd = user.subscription?.currentPeriodEnd;

  // Plan limits map
  const planLimits = {
    free: { websites: 1, label: '1 Site' },
    starter: { websites: 5, label: '5 Sites' },
    pro: { websites: Infinity, label: 'Unlimited' }
  };

  const currentLimit = planLimits[plan] || planLimits.free;
  const pct = currentLimit.websites === Infinity 
    ? 100 
    : Math.min(100, Math.round((websitesCount / currentLimit.websites) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight font-display">
          Account Profile & Billing
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor your subscription status, API usage limits, and account preferences.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center text-center justify-between">
          <div className="space-y-4 w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/20 mx-auto">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
            </div>
            <div className="px-3 py-1 bg-purple-950/40 border border-purple-800/40 rounded-full text-xs text-purple-300 font-semibold uppercase tracking-wider inline-block">
              {user.role === 'admin' ? 'Administrator' : 'Business Owner'}
            </div>
          </div>
          
          <div className="w-full border-t border-slate-800/80 mt-6 pt-6 text-left space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-semibold text-slate-200">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription & Limits meters */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Subscription Info Panel */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4 mb-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Plan</p>
                <h2 className="text-2xl font-extrabold text-white capitalize mt-0.5 flex items-center gap-2">
                  {plan} Plan
                  <span className={`px-2.5 py-0.5 text-xs rounded-full ${
                    planStatus === 'active' 
                      ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400' 
                      : 'bg-yellow-950/60 border border-yellow-800/60 text-yellow-400'
                  }`}>
                    {planStatus}
                  </span>
                </h2>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md active:scale-95"
              >
                Change Subscription Plan
              </button>
            </div>

            <div className="space-y-4">
              {periodEnd && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Renewal / Expire Date:</span>
                  <span className="font-semibold text-slate-200">
                    {new Date(periodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="text-sm">
                <span className="text-slate-400">Stripe Customer Reference ID:</span>
                <p className="font-mono text-xs text-slate-300 bg-slate-950/60 rounded px-2.5 py-1.5 border border-slate-800 mt-1 truncate">
                  {user.subscription?.stripeSubscriptionId || 'N/A (Local Mock Subscription Bypass Enabled)'}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Limit Sliders */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Plan Resource Limits</h3>
            
            {/* Website generator meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-semibold">Websites Generated</span>
                <span className="text-slate-400">
                  {websitesCount} / {currentLimit.websites === Infinity ? '∞' : currentLimit.websites}
                </span>
              </div>
              
              <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${pct}%` }} 
                />
              </div>
              
              <p className="text-xs text-slate-400">
                {plan === 'free' 
                  ? 'Upgrade to Starter to create up to 5 websites or Pro for unlimited sites.' 
                  : plan === 'starter' 
                  ? 'Upgrade to Pro for unlimited AI websites.' 
                  : 'You have unlimited generated websites.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
