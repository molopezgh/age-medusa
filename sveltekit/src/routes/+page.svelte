<!-- src/routes/+page.svelte -->
<script lang="ts">
  export let data: {
    products: { id: string, title: string, description: string }[];
  };

  const { products } = data;
</script>

<h1>Our Courses</h1>

{#if products && products.length > 0}
  <ul>
    {#each products as product (product.id)}
      <li class="product-item">
        <div class="product-info">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
        </div>
        <!-- Separate 'Buy Now' button wrapping the link to the product details page -->
        <a href={`/products/${product.id}`} class="buy-button">
          Buy Now
        </a>
      </li>
    {/each}
  </ul>
{:else}
  <p>No products found.</p>
{/if}

<style>
  /* Style for the list items */
  .product-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
  }

  /* Styling for the product info section */
  .product-info {
    flex-grow: 1;
  }

  /* Styling for the Buy Now button */
  .buy-button {
    padding: 0.5rem 1rem;
    background-color: #0070f3;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    margin-left: 1rem;
  }

  .buy-button:hover {
    background-color: #005bb5;
  }
</style>
