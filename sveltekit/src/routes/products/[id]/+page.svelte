<!-- src/routes/products/[id]/+page.svelte -->
<script lang="ts">
  // Data injected from the load function in +page.ts.
  export let data: {
    product: { id: string; title: string; description: string; /* other fields as needed */ }
  };

  const { product } = data;
</script>

<h1>{product.title}</h1>
<p>{product.description}</p>

<!-- You can add additional information, images, or a "Buy Now" button here -->
