<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { grid },
  getCalendarAttrs
} = getCtx();
const attrs = getCalendarAttrs("grid");
$: builder = $grid;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<table bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</table>
{/if}
