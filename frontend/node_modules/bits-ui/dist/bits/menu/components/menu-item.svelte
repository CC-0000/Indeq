<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { disabledAttrs } from "../../../internal/index.js";
import { createDispatcher } from "../../../internal/events.js";
export let href = void 0;
export let asChild = false;
export let disabled = false;
export let el = void 0;
const {
  elements: { item },
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
$: builder = $item;
$: attrs = { ...getAttrs("item"), ...disabledAttrs(disabled) };
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<svelte:element
		this={href ? "a" : "div"}
		bind:this={el}
		{href}
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
	</svelte:element>
{/if}
