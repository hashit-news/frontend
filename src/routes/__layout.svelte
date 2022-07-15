<script>
  import Navbar from '$lib/components/Navbar/Navbar.svelte';

  import '../app.css';
</script>

<div class="bg-base-300 h-screen">
  <div class="w-8/12 m-auto h-screen">
    <Navbar />
    <slot />
  </div>
</div>
