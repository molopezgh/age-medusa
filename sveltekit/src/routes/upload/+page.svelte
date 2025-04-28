<!-- File: C:\Users\lorpe\Desktop\medusa\sveltekit\src\routes\upload\+page.svelte -->

<script>
  // Form state
  let file;
  let title = '';
  let description = '';
  let price = '';

  const STORE_KEY = 'pk_451cd1b7c4a32bb3ea0bb58731a54f19f08319232f03fea2f9f64be76b385f33';
  const ADMIN_KEY = 'sk_b56f15ba7e088625e836a5a4330cd5e35977f86c40e9c5465e11907d8188870';

  // Upload the video file
  async function uploadVideo() {
    if (!file) {
      alert('Please select a video file first.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    const uploadRes = await fetch('/store/upload-video', {
      method: 'POST',
      headers: { 'x-publishable-api-key': STORE_KEY },
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      console.error('Upload failed:', uploadData);
      alert('Video upload failed. Check console.');
      return;
    }

    // Received URL for the uploaded file
    const videoUrl = uploadData.url;
    console.log('Uploaded video URL:', videoUrl);

    // Create product in Medusa Admin
    await saveProduct(videoUrl);
  }

  // Create product with required options & variant options
  async function saveProduct(videoUrl) {
    const product = {
      title,
      description,
      options: [
        { title: 'Title', values: ['Default'] }
      ],
      variants: [
        { title: 'Default', options: { Title: 'Default' }, prices: [{ currency_code: 'usd', amount: parseInt(price) * 100 }] }
      ],
      metadata: { video_url: videoUrl }
    };

    const res = await fetch('/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(ADMIN_KEY + ':')
      },
      body: JSON.stringify(product)
    });

    // Improved error handling: only parse JSON if content-type is JSON
    let result;
    if (res.headers.get('content-type')?.includes('application/json')) {
      result = await res.json();
    } else {
      result = { error: await res.text() };
    }

    if (!res.ok) {
      console.error('Product creation failed:', result);
      alert(`Product creation failed: ${result.error || result.message}`);
      return;
    }

    alert('Product created successfully!');
    console.log('New product:', result);
  }
</script>

<style>
  .form-container { max-width: 480px; margin: 2rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
  .form-field { margin-bottom: 1rem; }
  .form-field input,
  .form-field textarea { width: 100%; padding: 0.5rem; border: 1px solid #bbb; border-radius: 4px; }
  button { background-color: #2563eb; color: white; padding: 0.6rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; }
  button:disabled { background-color: #9ca3af; cursor: not-allowed; }
</style>

<div class="form-container">
  <h1 class="text-xl font-bold mb-4">Upload a Video Product</h1>

  <div class="form-field">
    <label for="title-input">Title</label>
    <input id="title-input" type="text" bind:value={title} placeholder="Enter product title" />
  </div>

  <div class="form-field">
    <label for="description-input">Description</label>
    <textarea id="description-input" bind:value={description} rows="3" placeholder="Enter product description"></textarea>
  </div>

  <div class="form-field">
    <label for="price-input">Price (USD)</label>
    <input id="price-input" type="number" bind:value={price} placeholder="e.g. 9.99" min="0" step="0.01" />
  </div>

  <div class="form-field">
    <label for="video-input">Video File</label>
    <input id="video-input" type="file" accept="video/*" on:change={e => file = e.target.files[0]} />
  </div>

  <button on:click={uploadVideo} disabled={!file || !title || !price}>
    Upload & Create Product
  </button>
</div>
