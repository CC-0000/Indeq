<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getAttrs } = getCtx();
const attrs = { ...getAttrs("grid-head"), "aria-hidden": true };
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead bind:this={el} {...$$restProps} {...attrs}>
		<slot />
	</thead>
{/if}
