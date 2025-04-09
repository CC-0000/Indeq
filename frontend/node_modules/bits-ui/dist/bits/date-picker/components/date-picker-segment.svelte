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
  getFieldAttrs
} = getCtx();
$: if (id && part !== "literal") {
  ids.dateField[part].set(id);
}
const attrs = getFieldAttrs("segment");
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
		on:m-focusout={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
