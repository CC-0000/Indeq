<!-- <script>
	export let company = 'Fill';
	export let isIntegrated = false;
	import { Button } from '$lib/components/ui/button/index.js';
	function authenticate() {
		window.location.href = `/profile/integration?provider=${company.toUpperCase()}`;
	}
</script>

<Button variant="outline" on:click={authenticate}>
	<span class="company-name">
		{#if isIntegrated}
			Disconnect
		{:else}
			Connect
		{/if}
	</span>
</Button> -->

<script>
	import { Button } from '$lib/components/ui/button/index.js';
	export let company = 'Fill';
	export let isIntegrated = false;

	function handleAction() {
		window.location.href = `/auth/${company.toUpperCase()}${isIntegrated ? '/disconnect' : ''}`;
	}
</script>

<Button variant="outline" on:click={handleAction}>
	<span class="company-name">
		{#if isIntegrated}
			Disconnect
		{:else}
			Connect
		{/if}
	</span>
</Button>