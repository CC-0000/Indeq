<script>import { melt } from "@melt-ui/svelte";
import { getSubTrigger } from "../ctx.js";
import { disabledAttrs } from "../../../internal/index.js";
import { createDispatcher } from "../../../internal/events.js";
export let disabled = false;
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { subTrigger },
  ids,
  getAttrs,
  options
} = getSubTrigger();
const { disabled: disabledStore } = options;
const dispatch = createDispatcher();
$: if (id) {
  ids.trigger.set(id);
}
$: builder = $subTrigger;
$: attrs = {
  ...getAttrs("sub-trigger"),
  ...disabledAttrs(disabled || $disabledStore)
};
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
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
		on:pointerenter
	>
		<slot {builder} />
	</div>
{/if}
