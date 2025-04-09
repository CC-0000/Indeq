<script>import { setInitialMode } from "./mode.js";
export let trueNonce = "";
export let initConfig;
export let themeColors = void 0;
</script>

<svelte:head>
	{#if themeColors}
		<!-- default to dark mode for to allow testing -->
		<!-- this will be overwritten by FOUC prevention snippet below -->
		<!-- but that snippet does not run in vitest -->
		<meta name="theme-color" content={themeColors.dark} />
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags, prefer-template --><!-- svelte-ignore hydration_html_changed -->
	{@html `<script${trueNonce ? ` nonce=${trueNonce}` : ""}>(` +
		setInitialMode.toString() +
		`)(` +
		JSON.stringify(initConfig) +
		`);</script>`}
</svelte:head>
