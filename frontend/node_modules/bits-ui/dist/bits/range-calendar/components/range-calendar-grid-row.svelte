<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getAttrs } = getCtx();
const attrs = getAttrs("grid-row");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tr bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tr>
{/if}
