<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { heading },
  states: { headingValue },
  getCalendarAttrs
} = getCtx();
const attrs = getCalendarAttrs("heading");
$: builder = $heading;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} headingValue={$headingValue} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} headingValue={$headingValue}>
			{$headingValue}
		</slot>
	</div>
{/if}
