<script>import { melt } from "@melt-ui/svelte";
import { setRadioItem } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let value;
export let disabled = false;
export let asChild = false;
export let el = void 0;
const {
  elements: { radioItem },
  getAttrs
} = setRadioItem(value);
const attrs = getAttrs("radio-item");
const dispatch = createDispatcher();
$: builder = $radioItem({ value, disabled });
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
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
		on:pointerenter
	>
		<slot {builder} />
	</div>
{/if}
