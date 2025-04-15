<!-- src/routes/+page.svelte -->
<script>
  // data is injected by the load function
  export let data;
  const { products } = data;
</script>

<h1>Our Courses</h1>

{#if products}
  {#each products as product}
    <h2>{product.title}</h2>
    <p>{product.description}</p>
    <!-- Add buttons or links for additional actions (like "Buy Now") -->
  {/each}
{:else}
  <p>Loading courses...</p>
{/if}
