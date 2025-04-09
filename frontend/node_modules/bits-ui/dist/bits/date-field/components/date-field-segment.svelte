<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let id = void 0;
export let part;
export let el = void 0;
const {
  elements: { segment },
  ids,
  getAttrs
} = getCtx();
$: if (id && part !== "literal") {
  ids[part].set(id);
}
const attrs = getAttrs("segment");
const dispatch = createDispatcher();
$: builder = $segment(part);
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
