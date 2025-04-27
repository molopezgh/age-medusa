<script lang="ts">
  // 1) Bring in the data from +page.ts
  export let data: {
    product: {
      id: string;
      title: string;
      description: string;
      variants: { id: string }[];
      // ...add any other fields you need
    }
  };
  const { product } = data;

  // 2) Your addToCart logic
  let adding = false;
  async function addToCart() {
    adding = true;
    const headers = {
      'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
      'Content-Type': 'application/json'
    };

    let cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) {
      const cartRes = await fetch('/store/carts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ region_id: 'reg_01JRRX7QY7TY3SM5RPRZK9082D' })
      });
      const { cart } = await cartRes.json();
      cartId = cart.id;
      localStorage.setItem('medusa_cart_id', cartId);
    }

    const variantId = product.variants[0].id;
    const lineRes = await fetch(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ variant_id: variantId, quantity: 1 })
    });

    if (!lineRes.ok) {
      alert('Error adding to cart');
    } else {
      alert('Added to cart!');
    }
    adding = false;
  }
</script>

<!-- 3) Render the actual product info -->
<main>
  <h1>{product.title}</h1>
  <p>{product.description}</p>

  <!-- 4) And your button -->
  <button on:click={addToCart} disabled={adding}>
    {adding ? 'Adding…' : 'Add to Cart'}
  </button>
</main>

<style>
  main {
    padding: 1rem;
  }
  button {
    margin-top: 1rem;
  }
</style>
