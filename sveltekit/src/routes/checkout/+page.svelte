<!-- src/routes/checkout/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadStripe } from '@stripe/stripe-js';

  // Load your Stripe publishable key from environment variables
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  async function handleCheckout() {
    // Call our SvelteKit API endpoint (see section 2) to create a checkout session.
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Optionally, send additional data (e.g., cart_id) in the body.
      body: JSON.stringify({})
    });

    if (!res.ok) {
      console.error('Checkout session creation failed');
      return;
    }

    const { sessionId } = await res.json();

    // Use Stripe.js to redirect to the Checkout page.
    const stripe = await stripePromise;
    if (stripe && sessionId) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe checkout error:', error);
      }
    }
  }
</script>

<h1>Checkout</h1>
<button on:click={handleCheckout}>
  Proceed to Payment
</button>
