<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let date;
export let month;
export let asChild = false;
export let el = void 0;
const {
  elements: { cell },
  helpers: { isDateDisabled, isDateUnavailable },
  getCalendarAttrs
} = getCtx();
const attrs = getCalendarAttrs("day");
$: builder = $cell(date, month);
$: Object.assign(builder, attrs);
$: disabled = $isDateDisabled(date);
$: unavailable = $isDateUnavailable(date);
</script>

{#if asChild}
	<slot {builder} {disabled} {unavailable} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} {disabled} {unavailable}>
			{date.day}
		</slot>
	</div>
{/if}
