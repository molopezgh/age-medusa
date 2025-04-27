// sveltekit/src/routes/api/verify-session/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// Initialize Stripe with your secret key
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'No sessionId provided' }), { status: 400 });
    }

    // 1) Retrieve the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId as string);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Payment not completed' }), { status: 402 });
    }

    // 2) (Optional) Mark the order as paid in Medusa
    // const cartId = session.metadata?.cart_id;
    // await fetch(`${env.VITE_MEDUSA_BACKEND_URL}/admin/orders/${cartId}/pay`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${env.MEDUSA_ADMIN_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // 3) Generate or look up your secure video URL
    // Replace this stub with your actual signed-URL logic (S3, Vimeo, etc.)
    const videoUrl = `http://localhost:5173/videos/placeholder.mp4`;

    return new Response(JSON.stringify({ videoUrl }), { status: 200 });
  } catch (err: any) {
    console.error('❌ verify-session error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
