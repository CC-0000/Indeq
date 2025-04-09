<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let value;
export let disabled = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { trigger },
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("trigger");
$: builder = $trigger({ value, disabled });
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
