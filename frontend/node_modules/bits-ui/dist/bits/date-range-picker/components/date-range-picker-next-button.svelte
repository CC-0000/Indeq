<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { nextButton },
  getCalendarAttrs
} = getCtx();
const attrs = getCalendarAttrs("next-button");
$: builder = $nextButton;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button bind:this={el} {...builder} use:builder.action type="button" {...$$restProps}>
		<slot {builder} />
	</button>
{/if}
