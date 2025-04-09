<script>import { melt } from "@melt-ui/svelte";
import { setItemCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let value;
export let disabled = false;
export let asChild = false;
export let el = void 0;
const {
  elements: { item },
  getAttrs
} = setItemCtx(value);
const dispatch = createDispatcher();
const attrs = getAttrs("item");
$: builder = $item({ value, disabled });
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
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
