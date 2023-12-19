import express from "express";
const router = express.Router();
import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

router.post('/charge', async (req, res) => {
  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency: 'USD',
      payment_method: paymentMethodId,
      payment_method_type:["card"],
      confirmation_method: 'manual',
      confirm: true,
    });
    
    // res.status(200).json({ success: true });
    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router