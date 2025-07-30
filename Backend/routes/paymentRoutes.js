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
      success_url: 'https://localhost:3000/success',
      cancel_url: 'https://localhost:3000/cancel',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout error:', error.message);
    res.status(500).json({ error: 'Stripe checkout failed. Try again.' });
  }
});

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// POST /api/payment/khalti/verify
router.post('/khalti/verify', async (req, res) => {
  const { token, amount, products, userId, name, address } = req.body;

  if (!token || !amount || !products || !name || !address) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment or user information.",
    });
  }

  try {
    // Verify payment with Khalti
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      { token, amount },
      { headers: { Authorization: `Key ${KHALTI_SECRET_KEY}` } }
    );

    // Save order to DB
    const order = new Order({
      user: userId || null,
      name,
      address,
      products: products.map(p => ({
        productId: p.product._id || p.productId || p.product,
        quantity: p.quantity,
        price: p.productPrice || 0,
      })),
      amount,
      paymentDetails: response.data,
      status: 'Paid',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Khalti payment verified and order saved successfully.',
      orderId: order._id,
      data: response.data,
    });
  } catch (error) {
    console.error('Khalti verification failed:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      message: 'Khalti payment verification failed.',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
