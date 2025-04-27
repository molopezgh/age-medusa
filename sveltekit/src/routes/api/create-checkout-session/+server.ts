// src/routes/api/create-checkout-session/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    // 1. Read the cartId sent from the frontend
    const { cartId } = await request.json();
    if (!cartId) {
      throw new Error('No cartId provided');
    }

    // 2. Fetch your Medusa cart
    const medusaRes = await fetch(
      `${env.VITE_MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      {
        headers: {
          'x-publishable-api-key': env.VITE_MEDUSA_PUBLISHABLE_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!medusaRes.ok) {
      const text = await medusaRes.text();
      throw new Error(`Failed to fetch cart: ${medusaRes.status} ${text}`);
    }
    const { cart } = await medusaRes.json();

    // 3. Map Medusa items to Stripe line_items
    const line_items = cart.items.map((item: any) => ({
      price_data: {
        currency: cart.currency_code,
        product_data: { name: item.title },
        unit_amount: item.unit_price
      },
      quantity: item.quantity
    }));

    // 4. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/cancel`
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('❌ Stripe session creation error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
};
