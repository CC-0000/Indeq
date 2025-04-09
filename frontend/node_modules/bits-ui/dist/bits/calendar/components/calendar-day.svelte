<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let date;
export let month;
export let asChild = false;
export let el = void 0;
const {
  elements: { cell },
  helpers: { isDateDisabled, isDateUnavailable, isDateSelected },
  getCalendarAttrs
} = getCtx();
const attrs = getCalendarAttrs("day");
const dispatch = createDispatcher();
$: builder = $cell(date, month);
$: Object.assign(builder, attrs);
$: disabled = $isDateDisabled(date);
$: unavailable = $isDateUnavailable(date);
$: selected = $isDateSelected(date);
</script>

{#if asChild}
	<slot {builder} {disabled} {unavailable} {selected} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps} on:m-click={dispatch}>
		<slot {builder} {disabled} {unavailable} {selected}>
			{date.day}
		</slot>
	</div>
{/if}
