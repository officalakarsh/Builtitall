import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RomeLogo from '../components/RomeLogo';
import { api } from '../services/api';
import { Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthPage({ defaultRegister = false }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(defaultRegister);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Twinkling Starfield Canvas inside Login
  useEffect(() => {
    const canvas = document.getElementById('auth-galaxy-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    const starCount = 60;

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
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        speed: 0.01 + Math.random() * 0.03,
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const data = await api.post(endpoint, formData);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.data && err.data.errors) {
        const errorDetails = err.data.errors.map(e => e.message).join(', ');
        setErrorMsg(`Validation failed: ${errorDetails}`);
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
      {/* Galaxy Canvas Background */}
      <canvas id="auth-galaxy-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      
      {/* Background radial halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-orb-primary opacity-10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 glow-orb-secondary opacity-10 filter blur-[100px] pointer-events-none" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center space-x-3 mb-8 relative z-10 hover:scale-[0.98] transition">
        <RomeLogo size="lg" />
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-display">Build It All</span>
          <span className="text-[10px] block uppercase tracking-widest text-indigo-400 font-bold leading-none">AI Builder</span>
        </div>
      </Link>

      {/* Glassmorphic Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-premium rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 font-light">
            {isRegister ? 'Register as business owner to launch websites' : 'Sign in to access your Build It All dashboard'}
          </p>
        </div>

        {/* Form Error Indicator */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs mb-6 animate-pulse">
            <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-2xl text-xs transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-2xl text-xs transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-2xl text-xs transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:scale-[1.01] transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 text-xs"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={14} />
                <span>{isRegister ? 'Register Owner' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Register/Login states */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-bold transition ml-0.5"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
