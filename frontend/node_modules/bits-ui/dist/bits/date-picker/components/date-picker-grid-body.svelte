<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getCalendarAttrs } = getCtx();
const attrs = getCalendarAttrs("grid-body");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tbody bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tbody>
{/if}
