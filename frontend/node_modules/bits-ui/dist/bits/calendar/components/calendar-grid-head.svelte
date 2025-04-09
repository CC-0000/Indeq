<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getCalendarAttrs } = getCtx();
const attrs = {
  ...getCalendarAttrs("grid-head"),
  "aria-hidden": true
};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</thead>
{/if}
