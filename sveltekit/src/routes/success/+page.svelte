<!-- src/routes/success/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let videoUrl: string | null = null;
  let error: string | null = null;
  let isLoading = true;

  // once downloaded, we can redirect or navigate home
  function handleDownload() {
    // Redirect back to home after download
    goto('/');
  }

  async function verifySession(sessionId: string) {
    try {
      const resp = await fetch('/api/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      if (data.videoUrl) {
        videoUrl = data.videoUrl;
      } else {
        throw new Error(data.error || 'No videoUrl returned');
      }
    } catch (e: any) {
      console.error('verify-session error:', e);
      error = e.message;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    const sessionId = $page.url.searchParams.get('session_id');
    if (sessionId) {
      verifySession(sessionId);
    } else {
      error = 'No session_id in URL';
      isLoading = false;
    }
  });
</script>

<main>
  <h1>Payment Success</h1>

  {#if isLoading}
    <p>Verifying your payment…</p>
  {:else if error}
    <p style="color: red;">Error: {error}</p>
    <button on:click={() => goto('/')}>Return Home</button>
  {:else}
    <p>Your payment is confirmed! Click below to download your video:</p>
    <a href={videoUrl} download on:click={handleDownload}>
      <button>Download Video</button>
    </a>
    <p>
      <button on:click={() => goto('/')}>Return Home</button>
    </p>
  {/if}
</main>

<style>
  main {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    text-align: center;
  }
  button {
    margin: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
  p {
    margin-bottom: 1rem;
  }
</style>
