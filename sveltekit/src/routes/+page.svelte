<script lang="ts">
  import { onMount } from 'svelte';
  onMount(async () => {
    const res = await fetch('/store/products', {
      headers: {
        'x-publishable-api-key': import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log('Client status:', res.status);
    console.log('Client JSON:', await res.json());
  });
  export let data: { products: any[] };
  const { products } = data;
</script>

<h1>Our Courses</h1>

{#if products.length}
  <ul>
    {#each products as p (p.id)}
  <li>
    <a href={`/products/${p.id}`}>
      <strong>{p.title}</strong>
    </a>
  </li>
{/each}
  </ul>
{:else}
  <p>Loading or no products found.</p>
{/if}
