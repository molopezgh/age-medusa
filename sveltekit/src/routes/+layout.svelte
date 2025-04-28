<script>
  // any layout-level logic or imports
</script>

<header>
  <nav>
    <!-- your navigation -->
    <a href="/">Home</a>
    <a href="/upload">Upload</a>
  </nav>
</header>

<main class="p-4">
  <!-- THIS SLOT is required to render your pages -->
  <slot />
</main>

<footer class="text-center text-sm mt-8">
  © 2025 Your Company
</footer>
