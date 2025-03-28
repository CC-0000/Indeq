<script lang="ts">
    import { SearchIcon, ChevronDownIcon, CheckIcon, FileIcon, FileTextIcon, HardDriveIcon } from "svelte-feather-icons";
    import { onDestroy } from 'svelte';
    import "katex/dist/katex.min.css";
    import { processReasoningMessage, processOutputMessage, toggleReasoning, processSource } from '$lib/utils/chat';
    import { renderLatex, renderContent } from '$lib/utils/katex';
	  import type { BotMessage, ChatState, Source } from "$lib/types/chat";

  let userQuery = '';
  let conversationId: string | null = null;
  const truncateLength = 80;

  let eventSource: EventSource | null = null;
  let messages: BotMessage[] = [];
  let isFullscreen = false;
  let isReasoning = false;
  let conversationContainer: HTMLElement | null = null;

  export let data: { integrations: string[] };
  const isIntegrated = (provider: string): boolean => {
    return data.integrations.includes(provider.toUpperCase());
  };

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

        messages = [...messages, { text: userQuery, sender: "user", reasoning: [], reasoningSectionCollapsed: false, sources: [] }];

      const data = await res.json();
      conversationId = data.conversation_id;

        messages = [...messages, { text: "", sender: "bot", reasoning: [], reasoningSectionCollapsed: false, sources: [] }];
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

        isFullscreen = true;
        isReasoning = false;

        const url = `/chat?conversationId=${encodeURIComponent(conversationId)}`;
        eventSource = new EventSource(url);
        let botMessage : BotMessage = { 
            text: "", 
            sender: "bot", 
            reasoning: [] as {text: string; collapsed: boolean}[],
            reasoningSectionCollapsed: false,
            sources: [] as Source[],
            sourcesScrollAtEnd: false,
            isScrollable: false 
        };

        eventSource.addEventListener('message', (evt) => {
          const payload = JSON.parse(evt.data);
          const type = payload.type;

          switch (type) {
            case "think_start":
                isReasoning = true;
                return;
            case "think_end":
                isReasoning = false;
                return;
            case "source":
                processSource(payload, botMessage);
                setTimeout(() => {
                    const scrollContainer = document.querySelector(`.scroll-container:last-child`) as HTMLElement;
                    if (scrollContainer) {
                        const isScrollable = scrollContainer.scrollWidth > scrollContainer.clientWidth;
                        messages = messages.map((msg, idx) => 
                            idx === messages.length - 1
                                ? {...msg, isScrollable}
                                : msg
                        );
                    }
                }, 0);
                return;
            case "end":
                if (eventSource) {
                    eventSource.close();
                }
                return;
            case "token":
                // state object to pass to the processing functions
                const state : ChatState = {
                    messages,
                    isReasoning
                };
                
                if (isReasoning) {
                    processReasoningMessage(payload.token, botMessage, state);
                    messages = state.messages;
                    isReasoning = state.isReasoning;
                } else {
                    processOutputMessage(payload.token, botMessage, state);
                    messages = state.messages;
                }
          }
        });

    eventSource.addEventListener('error', (err) => {
      console.error('SSE error:', err);
      eventSource?.close();
    });
  }

    onDestroy(() => {
        eventSource?.close();
    });

    function handleScroll(e: Event, messageIndex: number) {
        const container = e.target as HTMLElement;
        const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
        const isScrollable = container.scrollWidth > container.clientWidth;
        messages = messages.map((msg, idx) => 
            idx === messageIndex 
                ? {...msg, sourcesScrollAtEnd: atEnd, isScrollable}
                : msg
        );
    }

    function checkScrollable(container: HTMLElement, messageIndex: number) {
        const isScrollable = container.scrollWidth > container.clientWidth;
        messages = messages.map((msg, idx) => 
            idx === messageIndex 
                ? {...msg, isScrollable}
                : msg
        );
    }

    function scrollToPosition(element: HTMLElement, messageIndex: number) {
        const message = messages[messageIndex];
        if (message.sourcesScrollAtEnd) {
            element.scrollTo({ left: 0, behavior: 'smooth' });
            // Wait for scroll animation to complete before updating state
            element.addEventListener('scrollend', () => {
                messages = messages.map((msg, idx) => 
                    idx === messageIndex 
                        ? {...msg, sourcesScrollAtEnd: false}
                        : msg
                );
            }, { once: true });
        } else {
            element.scrollTo({ left: element.scrollWidth, behavior: 'smooth' }); // Add smooth scrolling
            // Wait for scroll animation to complete before updating state
            element.addEventListener('scrollend', () => {
                messages = messages.map((msg, idx) => 
                    idx === messageIndex 
                        ? {...msg, sourcesScrollAtEnd: true}
                        : msg
                );
            }, { once: true });
        }
    }

    // Add the action to check scrollability on mount
    function initScrollCheck(node: HTMLElement, messageIndex: number) {
        checkScrollable(node, messageIndex);
        
        const resizeObserver = new ResizeObserver(() => {
            checkScrollable(node, messageIndex);
        });
        
        resizeObserver.observe(node);
        
        return {
            destroy() {
                resizeObserver.disconnect();
            }
        };
    }

</script>

<svelte:head>
  <title>Indeq</title>
  <meta name="description" content="Chat with Indeq" />
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center p-6">
  {#if !isFullscreen}
    <!-- Centered Search Box -->
    <div class="w-full max-w-3xl p-8 text-center">
      <h1 class="text-4xl text-gray-900 mb-3">Indeq</h1>
      <p class="text-gray-600 mb-6">
        Crawl your content in seconds, so you can spend more time on what matters.
      </p>

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
        <!-- Google -->
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div
              class="w-2 h-2 rounded-full"
              style="background-color: {isIntegrated('GOOGLE') ? 'green' : 'red'}"
            ></div>
            <div
              class="w-2 h-2 rounded-full absolute top-0 animate-ping"
              style="background-color: {isIntegrated('GOOGLE') ? 'green' : 'red'}"
            ></div>
          </div>
          <span class="text-sm text-gray-600">Google</span>
        </div>
        <!-- Microsoft -->
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div
              class="w-2 h-2 rounded-full"
              style="background-color: {isIntegrated('MICROSOFT') ? 'green' : 'red'}"
            ></div>
            <div
              class="w-2 h-2 rounded-full absolute top-0 animate-ping"
              style="background-color: {isIntegrated('MICROSOFT') ? 'green' : 'red'}"
            ></div>
          </div>
          <span class="text-sm text-gray-600">Microsoft</span>
        </div>
        <!-- Notion -->
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <div class="relative">
            <div
              class="w-2 h-2 rounded-full"
              style="background-color: {isIntegrated('NOTION') ? 'green' : 'red'}"
            ></div>
            <div
              class="w-2 h-2 rounded-full absolute top-0 animate-ping"
              style="background-color: {isIntegrated('NOTION') ? 'green' : 'red'}"
            ></div>
          </div>
          <span class="text-sm text-gray-600">Notion</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex-1 flex flex-col bg-white w-full max-w-3xl">
      <div
        class="conversation-container flex-1 overflow-y-auto p-4 space-y-6"
        bind:this={conversationContainer}
      >
        {#each messages as message, messageIndex}
          <div class="space-y-4">
            <div class="prose max-w-3xl mx-auto prose-lg">
              {#if message.sender === 'user'}
                <div class="font-bold prose-xl">{message.text}</div>
              {:else}
                {#if message.sources.length > 0}
                  <div class="mb-6">
                      <div class="flex justify-between items-center mb-2">
                          <h3 class="text-sm font-semibold text-gray-600">Sources</h3>
                          {#if message.isScrollable}
                          <button 
                              class="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                              on:click={(e) => {
                                  const target = e.target as HTMLElement;
                                  const scrollContainer = target.closest('.mb-6')?.querySelector('.scroll-container');
                                  if (scrollContainer) {
                                      scrollToPosition(scrollContainer as HTMLElement, messageIndex);
                                  }
                              }}
                          >
                              {message.sourcesScrollAtEnd ? '← Scroll to start' : 'Scroll to end →'}
                          </button>
                          {/if}
                      </div>

                      <!-- Scroll container -->
                      <div class="relative">
                          <div 
                              class="flex overflow-x-auto pb-4 gap-3 scrollbar-thin scroll-container"
                              on:scroll={(e) => handleScroll(e, messageIndex)}
                              use:initScrollCheck={messageIndex}
                          >
                              {#each message.sources as source, i}
                                  <div class="flex-none w-[325px]">
                                      <div class="bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-colors group-[{i}]">
                                          <div class="flex items-center gap-2 text-gray-400 mb-1">
                                              <HardDriveIcon size="14" />
                                              |
                                              {#if source.extension === 'pdf'}
                                                  <FileTextIcon size="14" />
                                              {:else if source.extension === 'docx'}
                                                  <FileIcon size="14" />
                                              {:else}
                                                  <FileIcon size="14" />
                                              {/if}
                                              <span class="text-[10px] uppercase tracking-wider font-medium">
                                                  {source.extension}
                                              </span>
                                          </div>
                                          <div>
                                              <h4 class="text-sm text-gray-900 truncate">{source.title}</h4>
                                              <p class="text-xs text-gray-500 truncate">{source.filePath}</p>
                                          </div>
                                      </div>
                                  </div>
                              {/each}
                          </div>
                      </div>
                  </div>
                  
                {/if}
                {#if message.reasoning.length > 0}
                  <div class="max-w-3xl mx-auto">
                    <div class="flex justify-between items-center">
                      <h3 class="text-sm font-semibold text-gray-600">Reasoning</h3>
                      <button
                        class="text-gray-600 cursor-pointer transition-transform duration-200 mt-3"
                        class:rotate-180={!message.reasoningSectionCollapsed}
                        on:click={() => {
                          if (message.sender !== 'user') {
                            messages = messages.map((msg, idx) =>
                              idx === messageIndex
                                ? {
                                    ...msg,
                                    reasoningSectionCollapsed: !msg.reasoningSectionCollapsed
                                  }
                                : msg
                            );
                          }
                        }}
                      >
                        <ChevronDownIcon size="16" />
                      </button>
                    </div>

                    {#if !message.reasoningSectionCollapsed}
                      {#each message.reasoning as thought, reasoningIndex}
                        <div class="rounded-lg pl-3 py-2 mb-3 w-full">
                          <div class="flex items-start w-full">
                            <div class="flex justify-between items-start gap-2 w-full">
                              <div class="flex items-start gap-2 flex-1 min-w-0">
                                <div class="shrink-0">
                                  {#if isReasoning && reasoningIndex === message.reasoning.length - 1}
                                    <div class="relative mt-3">
                                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <div
                                        class="w-2 h-2 bg-green-400 rounded-full absolute top-0 animate-ping"
                                      ></div>
                                    </div>
                                  {:else if isReasoning}
                                    <div class="w-2 h-2 bg-gray-400 rounded-full mt-3"></div>
                                  {:else}
                                    <CheckIcon size="16" class="text-gray-500 mt-2" />
                                  {/if}
                                </div>
                                <div class="text-gray-600 reasoning-container">
                                  <div
                                    class={`reasoning-content ${thought.collapsed ? 'collapsed' : 'expanded'}`}
                                  >
                                    {@html renderLatex(thought.text)}
                                  </div>
                                </div>
                              </div>
                              {#if thought.text.length > truncateLength}
                                <button
                                  class="text-gray-600 shrink-0 cursor-pointer transition-transform duration-200 mt-2"
                                  class:rotate-180={!thought.collapsed}
                                  on:click={() => {
                                    const state = {
                                      messages,
                                      isReasoning
                                    };
                                    toggleReasoning(messageIndex, reasoningIndex, state);
                                    messages = state.messages;
                                  }}
                                >
                                  <ChevronDownIcon size="16" />
                                </button>
                              {/if}
                            </div>
                          </div>
                        </div>
                      {/each}
                    {/if}
                  </div>
                {/if}
                {#if message.text !== ''}
                  <h3 class="text-sm font-semibold text-gray-600">Answer</h3>
                  <div class="mt-4 prose max-w-3xl mx-auto prose-lg">
                    {@html renderContent(message.text)}
                  </div>
                {:else}
                  <div class="animate-pulse mt-4">Thinking...</div>
                {/if}
              {/if}
            </div>
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

<style>
  .reasoning-container {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .reasoning-content {
    transition: all 0.3s ease;
  }

  .reasoning-content.collapsed {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 1.5em;
  }

    .reasoning-content.expanded {
      white-space: normal;
      max-height: 500px;
    }

    .scrollbar-thin {
        scrollbar-width: thin;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
    }

    .scrollbar-thin::-webkit-scrollbar {
        height: 6px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
        margin: 0;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    .group {
        position: relative;
    }

    /* Prevent tooltip from being cut off */
    .scroll-container {
        margin-top: 0;
        padding-top: 0;
    }

    /* Remove previous tooltip styles and add these */
    .pointer-events-none {
        pointer-events: none;
    }
    
    .pointer-events-auto {
        pointer-events: auto;
    }

</style>
