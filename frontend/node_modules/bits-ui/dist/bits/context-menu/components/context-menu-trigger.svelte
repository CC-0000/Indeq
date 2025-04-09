<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { trigger },
  ids,
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("trigger");
$: if (id) {
  ids.trigger.set(id);
}
$: builder = $trigger;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-contextmenu={dispatch}
		on:m-pointercancel={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointermove={dispatch}
		on:m-pointerup={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
