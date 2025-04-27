<script lang="ts">
  import { loadStripe } from '@stripe/stripe-js';

  // 0) Verify your key is loaded
  console.log('🔑 Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  async function handleCheckout() {
    console.log('🚀 handleCheckout called');

    // 1) Request a session
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId: localStorage.getItem('medusa_cart_id')
      })
    });
    console.log('📡 session creation status:', res.status);

    const text = await res.text();
    console.log('📖 session creation response body:', text);

    if (!res.ok) {
      console.error('❌ create-checkout-session failed');
      return;
    }

    const { sessionId } = JSON.parse(text);
    console.log('🔑 received sessionId:', sessionId);

    // 2) Redirect via Stripe.js
    const stripe = await stripePromise;
    console.log('✨ stripe object:', stripe);

    const { error } = await stripe!.redirectToCheckout({ sessionId });
    if (error) {
      console.error('⚠️ redirectToCheckout error:', error);
    } else {
      console.log('✔️ redirectToCheckout succeeded');
    }
  }
</script>

<h1>Checkout</h1>
<button on:click={handleCheckout}>
  Proceed to Payment
</button>
