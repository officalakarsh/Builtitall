const User = require('../models/user');
const stripe = require('stripe');

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return stripe(secretKey);
};

// @desc    Create Stripe Checkout Session for subscription
// @route   POST /api/billing/checkout
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  const { planName } = req.body;
  const user = req.user;

  if (!['starter', 'pro'].includes(planName)) {
    return res.status(400).json({ success: false, message: 'Invalid subscription plan selected' });
  }

  const stripeInstance = getStripeInstance();

  // If no Stripe Secret Key, trigger mock checkout bypass for ease of development/testing!
  if (!stripeInstance) {
    console.warn('STRIPE_SECRET_KEY not set. Invoking mock billing bypass.');
    
    // Simulate updating user subscription to selected plan
    try {
      const updatedUser = await User.findById(user._id);
      updatedUser.subscription = {
        plan: planName,
        status: 'active',
        stripeCustomerId: 'cus_mock_' + Math.random().toString(36).substring(7),
        stripeSubscriptionId: 'sub_mock_' + Math.random().toString(36).substring(7),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      await updatedUser.save();

      return res.status(200).json({
        success: true,
        isMock: true,
        message: `Successfully upgraded to ${planName.toUpperCase()} plan (Mock Billing Bypass)`,
        data: updatedUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get price ID from environment
  const priceMap = {
    starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_dummy_id',
    pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_dummy_id'
  };

  const priceId = priceMap[planName];

  try {
    // Check if user already has a customer ID, if not create customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripeInstance.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() }
      });
      stripeCustomerId = customer.id;
      
      // Save customer ID
      await User.findByIdAndUpdate(user._id, { 'subscription.stripeCustomerId': stripeCustomerId });
    }

    // Create session
    const session = await stripeInstance.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/profile?checkout_canceled=true`,
      metadata: {
        userId: user._id.toString(),
        planName
      }
    });

    res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe Session error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/billing/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  const stripeInstance = getStripeInstance();
  if (!stripeInstance) {
    return res.status(500).send('Stripe instance not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Stripe webhooks require the raw body buffer to verify signatures correctly!
    event = stripeInstance.webhooks.constructEvent(
      req.rawBody || req.body, // In case of standard configuration fallback
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planName = session.metadata.planName;
        const subscriptionId = session.subscription;

        // Get subscription period end
        const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
        const periodEnd = new Date(subscription.current_period_end * 1000);

        await User.findByIdAndUpdate(userId, {
          'subscription.plan': planName,
          'subscription.status': 'active',
          'subscription.stripeSubscriptionId': subscriptionId,
          'subscription.currentPeriodEnd': periodEnd
        });
        console.log(`User ${userId} upgraded to ${planName}`);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const subscription = await stripeInstance.subscriptions.retrieve(subscriptionId);
          const periodEnd = new Date(subscription.current_period_end * 1000);

          await User.findOneAndUpdate(
            { 'subscription.stripeSubscriptionId': subscriptionId },
            {
              'subscription.status': 'active',
              'subscription.currentPeriodEnd': periodEnd
            }
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        await User.findOneAndUpdate(
          { 'subscription.stripeSubscriptionId': subscriptionId },
          {
            'subscription.plan': 'free',
            'subscription.status': 'active',
            'subscription.stripeSubscriptionId': null,
            'subscription.currentPeriodEnd': null
          }
        );
        console.log(`Stripe subscription ${subscriptionId} deleted`);
        break;
      }
      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).send('Webhook Event processing error');
  }
};
