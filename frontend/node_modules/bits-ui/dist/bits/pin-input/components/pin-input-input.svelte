<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { input },
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("input");
$: builder = $input();
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<input
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-keydown={dispatch}
		on:m-input={dispatch}
		on:m-paste={dispatch}
		on:m-change={dispatch}
		on:m-focus={dispatch}
		on:m-blur={dispatch}
	/>
{/if}
