const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add key in .env

router.post('/create-checkout-session', async (req, res) => {
  const { products } = req.body;

  try {
    const line_items = products.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
        },
        unit_amount: Math.round(item.productPrice * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout error:', error.message);
    res.status(500).json({ error: 'Stripe checkout failed. Try again.' });
  }
});

module.exports = router;
