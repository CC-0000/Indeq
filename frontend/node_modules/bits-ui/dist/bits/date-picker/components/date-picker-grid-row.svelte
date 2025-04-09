<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getCalendarAttrs } = getCtx();
const attrs = getCalendarAttrs("grid-row");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tr bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tr>
{/if}
