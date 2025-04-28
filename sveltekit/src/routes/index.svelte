<script>
  let file;
  let title = '';
  let description = '';
  let price = '';
  const STORE_KEY = 'pk_451cd1b7c4a32bb3ea0bb58731a54f19f08319232f03fea2f9f64be76b385f33';

  async function uploadVideo() {
    if (!file) {
      alert('Please select a video file first.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    // 1) Upload the video
    const uploadRes = await fetch('/store/upload-video', {
      method: 'POST',
      headers: { 'x-publishable-api-key': STORE_KEY },
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      console.error('Upload failed:', uploadData);
      alert('Video upload failed. See console.');
      return;
    }

    const videoUrl = uploadData.url; // e.g. "/uploads/336dd340caa60df0a98a84848e6488fb.mp4"

    // 2) Create the product in Medusa
    const product = {
      title,
      description,
      variants: [
        { title: 'Default', prices: [{ currency_code: 'usd', amount: +price * 100 }] }
      ],
      metadata: { video_url: videoUrl }
    };
    const productRes = await fetch('/admin/products', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const productData = await productRes.json();
    if (!productRes.ok) {
      console.error('Product creation failed:', productData);
      alert('Product creation failed. See console.');
      return;
    }

    alert('Product created successfully!');
    console.log('Product:', productData);
  }
</script>

<div class="p-4 max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-4">Upload a Video Product</h2>

  <input type="text" placeholder="Title" bind:value={title} class="border p-2 mb-2 w-full" />
  <textarea placeholder="Description" bind:value={description} class="border p-2 mb-2 w-full"></textarea>
  <input type="number" placeholder="Price (USD)" bind:value={price} class="border p-2 mb-2 w-full" />

  <input type="file" accept="video/*" on:change={e => file = e.target.files[0]} class="mb-4 w-full" />

  <button on:click={uploadVideo} class="bg-blue-600 text-white py-2 px-4 rounded">
    Upload & Create Product
  </button>
</div>
