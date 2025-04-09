<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let id = void 0;
export let part;
export let type;
export let el = void 0;
const {
  elements: { startSegment, endSegment },
  ids,
  getAttrs
} = getCtx();
$: if (id && part !== "literal") {
  if (type === "start") {
    ids.start[part].set(id);
  } else {
    ids.end[part].set(id);
  }
}
const attrs = getAttrs("segment");
const dispatch = createDispatcher();
$: builder = type === "start" ? $startSegment(part) : $endSegment(part);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
