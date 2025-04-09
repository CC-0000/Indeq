<script>import { melt } from "@melt-ui/svelte";
import { getTrigger } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { trigger },
  props,
  getAttrs
} = getTrigger();
const dispatch = createDispatcher();
const attrs = getAttrs("trigger");
$: builder = $trigger({
  ...$props
});
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
		on:m-keydown={dispatch}
		on:m-click={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
