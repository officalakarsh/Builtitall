import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, Check, X, Phone, Mail, Clock, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  const fetchBookings = async () => {
    try {
      const data = await api.get('/bookings');
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await api.get('/bookings');
        if (active && data.success) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const data = await api.put(`/bookings/${id}/status`, { status });
      if (data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Error updating booking status.');
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'pending':
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-10 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Bookings & Leads</h1>
        <p className="text-sm text-slate-400">Review appointment queues and manage customers' confirmations.</p>
      </div>

      {/* Tabs Filter toolbar */}
      <div className="flex space-x-1.5 p-1 glass border border-white/5 rounded-xl self-start w-fit">
        {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`
              px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-200
              ${filter === tab 
                ? 'bg-purple-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <span className="w-7 h-7 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading appointment records...</span>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <motion.div 
              key={booking._id}
              layout
              className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              {/* Left detail elements */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-extrabold text-white">{booking.customerName}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-md ${getStatusPill(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-xs text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase">
                    {booking.businessId?.businessName}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CalendarRange size={14} className="text-slate-500" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-500" />
                    <span>{booking.bookingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-500" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-500" />
                    <span className="truncate">{booking.email}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  Service Request: <span className="text-indigo-300 font-bold">{booking.service || 'General Inquiry'}</span>
                </p>
              </div>

              {/* Action buttons (Confirm/Cancel status hooks) */}
              <div className="flex items-center gap-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking._id, 'confirmed')}
                      className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white rounded-xl transition duration-200"
                      title="Confirm Appointment"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking._id, 'cancelled')}
                      className="p-3 bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500 hover:text-white rounded-xl transition duration-200"
                      title="Cancel Appointment"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
                {booking.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange(booking._id, 'pending')}
                    className="text-xs font-bold text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 px-3 py-2 rounded-xl transition"
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-white/5 max-w-xl mx-auto space-y-4">
          <ShieldAlert className="text-slate-600 mx-auto" size={40} />
          <div>
            <h3 className="text-lg font-bold text-white">No bookings found</h3>
            <p className="text-sm text-slate-400">
              No bookings match this filter category right now. Any client scheduling on generated websites will show up here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
