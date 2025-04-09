<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { calendar },
  states: { months: localMonths, weekdays },
  ids,
  getCalendarAttrs
} = getCtx();
$: if (id) {
  ids.calendar.calendar.set(id);
}
const attrs = getCalendarAttrs("root");
$: builder = $calendar;
$: Object.assign(builder, attrs);
let months = $localMonths;
$: months = $localMonths;
</script>

{#if asChild}
	<slot {builder} {months} weekdays={$weekdays} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} {months} weekdays={$weekdays} />
	</div>
{/if}
