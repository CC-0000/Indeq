<script>
    import { SearchIcon } from "svelte-feather-icons";
  </script>
  
  <main class="min-h-screen flex flex-col items-center justify-center p-6">
    <!-- Centered Search Box -->
    <div class="w-full max-w-3xl p-8 text-center">
      <!-- Header -->
      <h1 class="text-4xl text-gray-900 mb-3">Indeq</h1>
      <p class="text-gray-600 mb-6">Crawl your content in seconds, so you can spend more time on what matters.</p>
  
      <!-- Search Input -->
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Search for private data insights..."
          class="flex-1 p-2 bg-transparent focus:outline-none"
        />
        <button
          class="p-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
        >
          <SearchIcon size="20" />
        </button>
      </div>

      <!-- Integration Badges -->
      <div class="flex gap-4 mt-4 justify-center">
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"></div>
          </div>
          <span class="text-sm text-gray-600">Google</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"></div>
          </div>
          <span class="text-sm text-gray-600">Microsoft</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"></div>
          </div>
          <span class="text-sm text-gray-600">Notion</span>
        </div>
      </div>
    </div>
  </main>