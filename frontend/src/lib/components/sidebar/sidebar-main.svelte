<script lang="ts">
	import NavItem from "./nav-item.svelte";
	import NavHistory from "./nav-history.svelte";
	import { sidebarExpanded } from '../../stores/sidbarStore';
	import { navigation } from '$lib/config/navigation';
  
	//TODO: Temporary static history data (replace with a historyStore)
	const tempHistory = [
	  { id: "chat-1", title: "This is a temporary search history test to see how it would look"},
	  { id: "chat-2", title: "This is just a visual to see what it will look like once chat history is up"},
	  { id: "chat-3", title: "I dont know what this typing is doing but did you see the double the the" },
	];
</script>

<nav class={`flex flex-col gap-1 pt-2 ${$sidebarExpanded ? "px-3" : ""}`}>
	{#each navigation.main as item}
		<NavItem {item} expanded={$sidebarExpanded} />
	{/each}
</nav>
<nav class="grid gap-0 pl-11 pr-2 p-0">
    {#each tempHistory as item}
        <NavHistory {item} expanded={$sidebarExpanded} />
    {/each}
</nav>