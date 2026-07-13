import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Globe, Eye, CalendarCheck, BarChart3, Plus, ArrowUpRight, 
  TrendingUp, Activity, CheckCircle, Clock, XCircle 
} from 'lucide-react';
import { api } from '../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Parallel data fetch
        const [analyticsData, bookingsData] = await Promise.all([
          api.get('/analytics'),
          api.get('/bookings').catch(() => ({ success: true, data: [] })) // Safe fallback if no bookings
        ]);

        if (analyticsData.success) {
          setAnalytics(analyticsData.data);
        }
        
        const bookingsList = bookingsData.data || (Array.isArray(bookingsData) ? bookingsData : []);
        setBookings(bookingsList.slice(0, 5)); // Show recent 5 entries
      } catch (err) {
        console.error(err);
        setErrorMsg('Error loading dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
        <span className="text-xs text-slate-400 tracking-wider">Synchronizing platform analytics...</span>
      </div>
    );
  }

  const { summary = {}, timeline = [], categoryDistribution = [], topSites = [] } = analytics || {};

  const statCards = [
    { label: 'Total Websites', value: summary.totalSites || 0, icon: Globe, color: 'text-blue-400', bg: 'hover:shadow-blue-500/5 hover:border-blue-500/20' },
    { label: 'Total Page Views', value: summary.totalViews || 0, icon: Eye, color: 'text-purple-400', bg: 'hover:shadow-purple-500/5 hover:border-purple-500/20' },
    { label: 'Appointments Booked', value: summary.totalBookings || 0, icon: CalendarCheck, color: 'text-pink-400', bg: 'hover:shadow-pink-500/5 hover:border-pink-500/20' },
    { label: 'Conversion Rate', value: `${summary.conversionRate || '0.0'}%`, icon: BarChart3, color: 'text-emerald-400', bg: 'hover:shadow-emerald-500/5 hover:border-emerald-500/20' }
  ];

  return (
    <div className="space-y-8 relative">
      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">System Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time metrics tracking views, bookings, and active local generator nodes.</p>
        </div>
        <Link 
          to="/dashboard/sites" 
          className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 flex items-center gap-2 hover:scale-[1.02] transition duration-200"
        >
          <Plus size={15} />
          <span>Generate New Site</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`glass p-6 rounded-3xl border border-white/5 space-y-4 transition-all duration-300 ${card.bg}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</span>
                <div className={`p-1.5 rounded-lg bg-white/5`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-white tracking-tight">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Feeds Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline and sites table */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Site Activity Timeline */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-base font-display">Website Activity Timeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">Visits and bookings trends over the past 7 days.</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-cyan-400 tracking-wider uppercase">
                <TrendingUp size={13} />
                <span>Sync Node Active</span>
              </div>
            </div>

            <div className="h-72 w-full">
              {timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', color: '#ffffff', borderRadius: '14px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={2} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorBookings)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                  No visual traffic logs recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Popular / Generated Sites Table */}
          <div className="glass rounded-3xl border border-white/5 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-white text-base font-display">Generated Sites Timeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Review generated domain logs, categories, and metrics totals.</p>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[9px] pb-3">
                    <th className="pb-3 px-4">Business Site</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Views</th>
                    <th className="pb-3 px-4">Bookings</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topSites.length > 0 ? (
                    topSites.map((site, index) => (
                      <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-bold text-white">
                          <div>
                            <span className="block">{site.name}</span>
                            <span className="text-[10px] font-mono font-normal text-slate-500">{`/site/${site.slug}`}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 uppercase text-[10px] tracking-wider text-purple-400 font-bold">
                          {site.category.replace('-', ' ')}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-200">{site.views}</td>
                        <td className="py-4 px-4 font-bold text-slate-200">{site.bookingsCount}</td>
                        <td className="py-4 px-4 text-right">
                          <Link 
                            to={`/dashboard/sites/${site.id}`}
                            className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800/80 px-2.5 py-1.5 rounded-lg font-bold hover:text-white hover:border-slate-700 transition duration-200 inline-flex items-center gap-1"
                          >
                            Edit
                            <ArrowUpRight size={10} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                        No active generation logs. Create your first site using the action button above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Donut Chart & Live Activity Feed */}
        <div className="space-y-8">
          
          {/* Traffic Distribution Donut Chart */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-6 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="font-bold text-white text-base font-display">Category Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Views allocation divided by templates categories.</p>
            </div>

            <div className="h-44 flex justify-center items-center relative my-4">
              {categoryDistribution.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistribution.filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', color: '#ffffff', borderRadius: '12px', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-xs text-slate-500 font-medium">
                  No distribution statistics logged.
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-4 border-t border-white/5">
              {categoryDistribution.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-400 capitalize">{item.name.replace('-', ' ')}</span>
                  </div>
                  <span className="font-bold text-white">{item.value} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-pink-400" />
              <h3 className="font-bold text-white text-base font-display">Recent Activity Feed</h3>
            </div>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-white/5 pb-3.5 last:border-0 last:pb-0">
                    <div className="shrink-0 mt-0.5">
                      {booking.status === 'approved' ? (
                        <CheckCircle size={15} className="text-emerald-400" />
                      ) : booking.status === 'cancelled' ? (
                        <XCircle size={15} className="text-rose-400" />
                      ) : (
                        <Clock size={15} className="text-amber-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-200 leading-normal font-light">
                        <strong className="font-semibold text-white">{booking.customerName}</strong> scheduled a booking slot at{' '}
                        <span className="text-indigo-400 font-semibold">{booking.businessId?.businessName || 'Business Site'}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-normal">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  No booking schedules or lead submissions logged yet.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
