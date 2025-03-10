<script lang="ts">
	import NavItem from "./nav-item.svelte";
	import { sidebarExpanded } from '../../stores/sidbarStore';
	import { navigation } from '$lib/config/navigation';
</script>

<nav class="mt-auto grid gap-1 p-1">
	{#each navigation.secondary as item}
		<NavItem {item} expanded={$sidebarExpanded} />
	{/each}
</nav>