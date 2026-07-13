import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, Wallet, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PricingPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Checkout Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'paypal', 'whatsapp'
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Card Visual States
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Get active user state
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const currentPlan = user?.subscription?.plan || 'free';

  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring and getting started.',
      features: [
        '1 Generated Website',
        '10 Bookings / month',
        'WhatsApp booking notifications',
        'Standard templates & styles',
        'Basic web analytics dashboard',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Starter',
      id: 'starter',
      price: '$19',
      period: 'month',
      description: 'Ideal for growing local shops and single businesses.',
      features: [
        '5 Generated Websites',
        '100 Bookings / month',
        'WhatsApp booking integration',
        'Access to all premium layouts',
        'Advanced Recharts analytics',
        'Priority customer support',
      ],
      cta: 'Upgrade to Starter',
      popular: true,
    },
    {
      name: 'Pro',
      id: 'pro',
      price: '$49',
      period: 'month',
      description: 'For power users, agencies, or multi-franchise owners.',
      features: [
        'Unlimited Websites',
        'Unlimited Bookings',
        'Priority WhatsApp API Support',
        'SEO customizer tool suite',
        'Detailed timeline analytics',
        'Dedicated account manager',
        'Instant content generation'
      ],
      cta: 'Go Pro',
      popular: false,
    },
  ];

  const handlePlanClick = (plan) => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (plan.id === 'free') return;
    
    setSelectedPlan(plan);
    setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
    setIsFlipped(false);
    setShowPaymentModal(true);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardDetails({ ...cardDetails, expiry: formatted });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPlan) return;

    setProcessingPayment(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await api.post('/billing/checkout', { planName: selectedPlan.id });
      
      if (response.isMock) {
        // Trigger success confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        setSuccessMessage(`Payment Successful! Upgraded to ${selectedPlan.name} plan.`);
        
        // Update user localstorage with new subscription info
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        // Wait to show success state, then redirect
        setTimeout(() => {
          setShowPaymentModal(false);
          navigate('/dashboard/profile');
        }, 2200);
      } else if (response.url) {
        // Redirect to Stripe checkout if real Stripe key is provided
        window.location.assign(response.url);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col items-center justify-center px-4 py-16">
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1 text-xs font-semibold text-purple-400 bg-purple-950/40 border border-purple-800/50 rounded-full uppercase tracking-wider inline-block mb-4"
        >
          Pricing Plans
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight mb-6 font-display"
        >
          Scale Your Business with AI
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed"
        >
          Generate gorgeous sites, streamline bookings, and track visual metrics. Choose a plan that matches your business scale.
        </motion.p>
      </div>

      {/* Action alerts */}
      <div className="w-full max-w-md mx-auto mb-8 relative z-10 text-center">
        {errorMessage && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-400 text-sm animate-pulse flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full relative z-10">
        {plans.map((plan, index) => {
          const isActive = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`rounded-3xl p-8 border flex flex-col relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-purple-500 bg-slate-900/80 shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)]' 
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold font-display">{plan.name}</h3>
                <p className="text-slate-400 text-sm mt-2 min-h-[40px]">{plan.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm font-medium ml-2">/ {plan.period}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={isActive}
                onClick={() => handlePlanClick(plan)}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${
                  isActive
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                    : plan.popular
                    ? 'bg-purple-600 hover:bg-purple-500 active:scale-95 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white text-slate-950 hover:bg-slate-200 active:scale-95'
                }`}
              >
                {isActive ? 'Current Plan' : plan.cta}
              </button>

              {/* Features List */}
              <div className="mt-auto border-t border-slate-800/80 pt-6">
                <p className="text-slate-300 text-sm font-semibold mb-4">Includes:</p>
                <ul className="space-y-3.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <svg
                        className="w-5 h-5 text-purple-400 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Checkout/Payment Gateway Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium rounded-3xl p-8 max-w-lg w-full relative border border-white/10 shadow-2xl space-y-6 text-white overflow-hidden"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                    <Lock className="text-purple-400" size={18} />
                    <span>Secure Checkout</span>
                  </h2>
                  <p className="text-xs text-slate-400">Complete your upgrade to the {selectedPlan.name} plan.</p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processingPayment}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Plan Overview Info */}
              <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wide">Selected Plan</span>
                  <span className="font-extrabold text-lg text-purple-400 font-display">{selectedPlan.name} Subscription</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{selectedPlan.price}</span>
                  <span className="text-xs text-slate-400 block">/ month</span>
                </div>
              </div>

              {/* Payment Gateway Tabs */}
              <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'card' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'paypal' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet size={14} />
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'whatsapp' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.48-.002 9.936-4.462 9.939-9.947.002-2.657-1.03-5.155-2.906-7.03C16.427 1.75 13.936.72 11.312.72 5.836.72 1.377 5.18 1.375 10.665c-.001 1.551.424 3.069 1.23 4.425l-1.014 3.702 3.813-1.001 1.243.687z" />
                  </svg>
                  <span>WhatsApp Pay</span>
                </button>
              </div>

              {/* Payment Methods Forms */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  {/* Credit Card Visual Element */}
                  <div className="relative w-full h-40 md:h-44 mx-auto mb-6 perspective-1000">
                    <div className={`relative w-full h-full duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Card Front */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 flex flex-col justify-between backface-hidden shadow-xl border border-white/10 text-white font-mono">
                        <div className="flex justify-between items-start">
                          <span className="text-xs uppercase tracking-widest font-semibold opacity-75">Build It All Card</span>
                          <div className="w-9 h-7 rounded bg-amber-400/80 opacity-90 relative overflow-hidden">
                            <div className="absolute inset-0 border border-amber-600/30 grid grid-cols-3 grid-rows-3 opacity-60">
                              {[...Array(9)].map((_, i) => <div key={i} className="border-t border-l border-amber-800/20" />)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-lg tracking-widest font-bold mb-2">
                            {cardDetails.number || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <div>
                              <span className="block opacity-65 uppercase">Card Holder</span>
                              <span className="font-semibold text-xs tracking-wider uppercase">{cardDetails.name || 'YOUR NAME'}</span>
                            </div>
                            <div>
                              <span className="block opacity-65 uppercase">Expires</span>
                              <span className="font-semibold text-xs tracking-wider">{cardDetails.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Card Back */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-800 p-6 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl border border-white/10 text-white font-mono">
                        <div className="h-9 bg-black w-full -mx-6 mt-2 opacity-90" />
                        <div className="flex justify-end items-center mt-4 pr-4">
                          <span className="text-[8px] uppercase tracking-wider opacity-60 mr-2">CVV</span>
                          <div className="bg-white text-black px-3 py-1 rounded text-right font-bold text-xs tracking-widest w-16">
                            {cardDetails.cvv || '•••'}
                          </div>
                        </div>
                        <div className="text-[8px] opacity-40 text-center leading-none mt-2">
                          This mock card is created for local environment payment gateway verification.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-xl text-xs transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-xl text-xs transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-xl text-xs transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CVV</label>
                        <input
                          type="text"
                          required
                          placeholder="000"
                          value={cardDetails.cvv}
                          onChange={handleCvvChange}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          className="w-full px-4 py-3 bg-black/40 border border-white/5 hover:border-white/10 focus:border-purple-500/50 focus:outline-none rounded-xl text-xs transition"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:scale-[1.01] transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 text-xs"
                  >
                    {processingPayment ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={14} />
                        <span>Securely Subscribe with Card</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                    <Wallet size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm">PayPal Express Payment</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      You will be redirected to PayPal's secure gateway to finalize the monthly billing authorization.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubscribe()}
                    disabled={processingPayment}
                    className="w-full py-4 bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl text-xs tracking-wider transition shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingPayment ? (
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <span>Redirect to PayPal Checkout</span>
                    )}
                  </button>
                </div>
              )}

              {paymentMethod === 'whatsapp' && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.48-.002 9.936-4.462 9.939-9.947.002-2.657-1.03-5.155-2.906-7.03C16.427 1.75 13.936.72 11.312.72 5.836.72 1.377 5.18 1.375 10.665c-.001 1.551.424 3.069 1.23 4.425l-1.014 3.702 3.813-1.001 1.243.687z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm">WhatsApp Pay Verification</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Send a secure check invoice request to WhatsApp. You can approve the subscription charge right inside your chat thread.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubscribe()}
                    disabled={processingPayment}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs tracking-wider transition shadow-md shadow-green-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingPayment ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Request WhatsApp Pay Code</span>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
