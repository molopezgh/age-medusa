<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  interface CartItem {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }

  let cartItems: CartItem[] = [];
  let subtotal = 0;
  let loading = true;
  let updating: Record<string, boolean> = {};

  const headers = {
    'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
    'Content-Type': 'application/json'
  };

  async function loadCart() {
    loading = true;
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) {
      cartItems = [];
      subtotal = 0;
      loading = false;
      return;
    }

    const res = await fetch(`/store/carts/${cartId}`, { headers });
    if (!res.ok) {
      console.error('Failed to fetch cart', await res.text());
      loading = false;
      return;
    }

    const { cart } = await res.json();
    // DEBUG: peek at the raw items shape
    console.log('🛒 raw cart items:', cart.items);

    // Map using the top‐level fields
    cartItems = cart.items.map((item: any) => ({
      id: item.id,
      title: item.title,           // was item.variant.product.title
      quantity: item.quantity,
      unit_price: item.unit_price   // cents
    }));
    subtotal = cart.subtotal;
    loading = false;
  }

  async function updateQty(itemId: string, newQty: number) {
    if (newQty < 1) return;
    updating[itemId] = true;
    const cartId = localStorage.getItem('medusa_cart_id');
    await fetch(`/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity: newQty })
    });
    await loadCart();
    updating[itemId] = false;
  }

  async function removeItem(itemId: string) {
    updating[itemId] = true;
    const cartId = localStorage.getItem('medusa_cart_id');
    await fetch(`/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'DELETE',
      headers
    });
    await loadCart();
    updating[itemId] = false;
  }

  function proceedToCheckout() {
    goto('/checkout');
  }

  onMount(loadCart);
</script>

<h1>Your Cart</h1>

{#if loading}
  <p>Loading your cart…</p>
{:else if cartItems.length === 0}
  <p>Your cart is empty. <a href="/">Browse courses</a>.</p>
{:else}
  <ul>
    {#each cartItems as item}
      <li class="item">
        <div class="info">
          <strong>{item.title}</strong>
          <div class="controls">
            <button
              on:click={() => updateQty(item.id, item.quantity - 1)}
              disabled={updating[item.id] || item.quantity === 1}>
              –
            </button>
            <span>{item.quantity}</span>
            <button
              on:click={() => updateQty(item.id, item.quantity + 1)}
              disabled={updating[item.id]}>
              +
            </button>
            <button
              class="remove"
              on:click={() => removeItem(item.id)}
              disabled={updating[item.id]}>
              Remove
            </button>
          </div>
        </div>
        <div class="price">
          ${(item.unit_price / 100).toFixed(2)}
        </div>
      </li>
    {/each}
  </ul>

  <p class="subtotal">
    <strong>Subtotal:</strong> ${(subtotal / 100).toFixed(2)}
  </p>

  <button class="checkout" on:click={proceedToCheckout}>
    Proceed to Checkout
  </button>
{/if}
<style>
  ul { list-style: none; padding: 0; }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.75rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  .controls {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
  button {
    padding: 0.25rem 0.5rem;
  }
  .remove {
    margin-left: 1rem;
    color: #c00;
  }
  .price {
    min-width: 4rem;
    text-align: right;
  }
  .subtotal {
    text-align: right;
    font-size: 1.1rem;
    margin-top: 1rem;
  }
  .checkout {
    display: block;
    margin: 1.5rem auto 0;
    padding: 0.75rem 1.5rem;
  }
</style>
