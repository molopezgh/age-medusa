import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    // (Optional) pull cart/lineItems from request body:
    // const { lineItems } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Example Course' },
            unit_amount: 5000
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/cancel`
    });

    return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
  } catch (err: any) {
    console.error('❌ Stripe session creation error:', err);
    // return the error message so you can see it in curl output
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
