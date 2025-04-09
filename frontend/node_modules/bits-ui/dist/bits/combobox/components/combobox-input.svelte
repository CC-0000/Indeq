<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let placeholder = void 0;
export let el = void 0;
export let id = void 0;
const {
  elements: { input },
  ids,
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("input");
$: if (id) {
  ids.trigger.set(id);
}
$: builder = $input;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} {placeholder} />
{:else}
	<input
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		{placeholder}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
		on:m-input={dispatch}
	/>
{/if}
