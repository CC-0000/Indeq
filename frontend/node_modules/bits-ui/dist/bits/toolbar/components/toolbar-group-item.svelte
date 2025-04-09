<script>import { melt } from "@melt-ui/svelte";
import { getGroupCtx } from "../ctx.js";
import { createDispatcher, disabledAttrs } from "../../../internal/index.js";
export let value;
export let disabled = false;
export let asChild = false;
export let el = void 0;
const {
  elements: { item },
  getAttrs
} = getGroupCtx();
const dispatch = createDispatcher();
$: attrs = { ...getAttrs("group-item"), ...disabledAttrs(disabled) };
$: builder = $item({ value, disabled });
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
