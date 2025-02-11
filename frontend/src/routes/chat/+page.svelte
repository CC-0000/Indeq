<script lang="ts">
  import { SearchIcon } from "svelte-feather-icons";
  import { onDestroy } from 'svelte';
  import { marked } from 'marked';

  let userQuery = '';
  let conversationId: string | null = null;

  let eventSource: EventSource | null = null;
  let messages: { text: string; sender: string }[] = [];
  let isStreaming: boolean = false;
  let isFullscreen = false;
  let conversationContainer;

  // Scroll to the bottom of the conversation
  function scrollToBottom() {
    const container = document.querySelector(".conversation-container");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }

  async function query() {
    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error('Error from /chat POST:', msg);
        return;
      }

      messages = [...messages, { text: userQuery, sender: "user" }];

      const data = await res.json();
      conversationId = data.conversation_id;

      messages = [...messages, { text: "", sender: "bot" }];
      streamResponse();
    } catch (err) {
      console.error('sendMessage error:', err);
    }

    // Reset the user query
    userQuery = '';
  }

  function streamResponse() {
    if (!conversationId) {
      console.error('No conversationId to stream');
      return;
    }
    // Close any existing connection
    eventSource?.close();

    isStreaming = true;
    isFullscreen = true;

    const url = `/chat?conversationId=${encodeURIComponent(conversationId)}`;
    eventSource = new EventSource(url);
    let botMessage = { text: "", sender: "bot" };

    eventSource.addEventListener('message', (evt) => {
      const payload = JSON.parse(evt.data);
      botMessage.text += payload.data;
      messages = [...messages.slice(0, -1), botMessage];
      scrollToBottom();
    });

    eventSource.addEventListener('error', (err) => {
      console.error('SSE error:', err);
      eventSource?.close();
    });
  }

  onDestroy(() => {
    eventSource?.close();
  });

</script>
  
  <main class="min-h-screen flex flex-col items-center justify-center p-6">
    {#if !isFullscreen}
    <!-- Centered Search Box -->
    <div class="w-full max-w-3xl p-8 text-center">
      
      <h1 class="text-4xl text-gray-900 mb-3">Indeq</h1>
      <p class="text-gray-600 mb-6">Crawl your content in seconds, so you can spend more time on what matters.</p>
  
      <!-- Search Input -->
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        
        <input
          type="text"
          bind:value={userQuery}
          placeholder="Search for private data insights..."
          class="flex-1 p-2 bg-transparent focus:outline-none"
          class:move-to-bottom={isFullscreen}
          on:keydown={(e) => e.key === 'Enter' && query()}
        />
        <button
          class="p-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
          on:click={query}
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
          <span class="text-sm text-gray-600">Notion</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"></div>
          </div>
          <span class="text-sm text-gray-600">Google Drive</span>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"></div>
          </div>
          <span class="text-sm text-gray-600">Slack</span>
        </div>
      </div>
    </div>
    {:else}
    <div class="flex-1 flex flex-col bg-white w-full max-w-3xl">

      <div class="conversation-container flex-1 overflow-y-auto p-4 space-y-6" bind:this={conversationContainer}>
        {#each messages as message}
          <div class="space-y-4">
            <!-- Result Text -->
            <div class="prose max-w-3xl mx-auto prose-lg">
              {#if message.text === "" && isStreaming}
                <div class="animate-pulse">Indexing...</div>
              {:else if message.sender === "user"}
                <div class="font-bold prose-xl">{message.text}</div>
              {:else}
                {@html marked(message.text)}
              {/if}
            </div>

            <!-- Sources 
            {#if result.sources.length > 0}
              <div class="max-w-3xl mx-auto">
                <h3 class="text-sm font-semibold text-gray-600">Sources</h3>
                <ul class="space-y-2">
                  {#each result.sources as source}
                    <li class="text-sm text-blue-500 hover:underline">
                      <a href={source.url} target="_blank">{source.title}</a>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if} -->
          </div>
        {/each}
      </div>

      <div class="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
        <input
          bind:value={userQuery}
          type="text"
          placeholder="Ask me anything..."
          class="w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          on:keydown={(e) => e.key === 'Enter' && query()}
        />
      </div>
    </div>
    {/if}
  </main>