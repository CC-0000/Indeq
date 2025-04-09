<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getAttrs } = getCtx();
const attrs = getAttrs("head-cell");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<th bind:this={el} {...$$restProps} {...attrs}>
		<slot />
	</th>
{/if}
