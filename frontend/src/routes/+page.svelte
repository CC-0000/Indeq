<script>
    import { LockIcon, MailIcon } from "svelte-feather-icons";
  import { onMount } from "svelte";

  // Blob positions and sizes
  let blobs = [
    { x: 30, y: 50, size: 200, color: "#a78bfa" }, // Purple
    { x: 50, y: 20, size: 250, color: "#93c5fd" }, // Blue
    { x: 70, y: 60, size: 300, color: "#fbcfe8" }, // Pink
  ];

  // Animate blobs
  onMount(() => {
    const animate = () => {
      blobs = blobs.map((blob) => ({
        ...blob,
        x: blob.x + (Math.random() - 0.5) * 0.5, // Random movement
        y: blob.y + (Math.random() - 0.5) * 0.5,
      }));
      requestAnimationFrame(animate);
    };
    animate();
  });
  </script>
  
  <main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 p-6 relative overflow-hidden">
    <!-- Blurred Gradient Animation -->
    {#each blobs as blob}
        <div
        class="absolute rounded-full opacity-50 blur-3xl"
        style={`width: ${blob.size}px; height: ${blob.size}px; background: ${blob.color}; left: ${blob.x}%; top: ${blob.y}%;`}
        ></div>
    {/each}
  
    <!-- Centered Content -->
    <div class="w-full max-w-md text-center relative z-10">
      <!-- App Name -->
      <h1 class="text-4xl text-gray-900 mb-3">Indeq</h1>
      <p class="text-gray-600 mb-8">Crawl your content in seconds, so you can spend more time on what matters.</p>
  
      <!-- Coming Soon Message -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <LockIcon size="18" class="text-primary" />
        <p class="text-lg pt-1 font-medium text-gray-700">Coming Soon, Join the waitlist</p>
      </div>
  
      <!-- Email Signup Form -->
      <form class="flex items-center gap-3">
        <div class="relative flex-1">
          <MailIcon size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email..."
            class="w-full pl-10 p-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          class="p-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
        >
          Notify Me
        </button>
      </form>
  
      <!-- Privacy Note -->
      <p class="text-sm text-gray-500 mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
  
      <!-- Social Media Links -->
      <div class="mt-8 flex items-center justify-center gap-4">
        <a href="#" class="text-gray-500 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <!-- Twitter Icon -->
            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.94 13.94 0 0 1 1.67 3.15a4.916 4.916 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.229-.616v.062a4.916 4.916 0 0 0 3.943 4.817 4.894 4.894 0 0 1-2.221.084 4.917 4.917 0 0 0 4.59 3.416 9.862 9.862 0 0 1-6.102 2.105c-.398 0-.79-.023-1.175-.068a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.504 14.01-14.01 0-.213-.005-.426-.015-.637A10.01 10.01 0 0 0 24 4.557z" />
          </svg>
        </a>
        <a href="#" class="text-gray-500 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <!-- LinkedIn Icon -->
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a href="#" class="text-gray-500 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <!-- GitHub Icon -->
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.766.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </main>
  
  <style>
    /* Smooth transitions for blobs */
    .absolute {
      transition: all 0.5s ease-out;
    }
  </style>