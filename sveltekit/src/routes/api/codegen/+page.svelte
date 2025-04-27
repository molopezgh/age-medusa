<!-- sveltekit/src/routes/codegen/+page.svelte -->
<script lang="ts">
  let prompt = 'Generate a SvelteKit load function that fetches Medusa products';
  let code = '';

  async function generate() {
    const res = await fetch('/api/codegen', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    code = data.code;
  }
</script>

<textarea bind:value={prompt} rows="3" cols="60" />
<button on:click={generate}>Generate Code</button>

{#if code}
  <h2>Output:</h2>
  <pre>{code}</pre>
{/if}
