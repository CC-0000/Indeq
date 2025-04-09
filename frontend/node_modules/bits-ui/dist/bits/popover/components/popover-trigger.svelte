<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { trigger },
  states: { open },
  ids,
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const bitsAttrs = getAttrs("trigger");
$: if (id) {
  ids.trigger.set(id);
}
$: attrs = {
  ...bitsAttrs,
  "aria-controls": $open ? ids.content : void 0
};
$: builder = $trigger;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		{...builder} use:builder.action
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
