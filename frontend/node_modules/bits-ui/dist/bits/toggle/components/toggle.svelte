<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let disabled = void 0;
export let pressed = void 0;
export let onPressedChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { pressed: localPressed },
  updateOption,
  getAttrs
} = setCtx({
  disabled,
  defaultPressed: pressed,
  onPressedChange: ({ next }) => {
    if (pressed !== next) {
      onPressedChange?.(next);
      pressed = next;
    }
    return next;
  }
});
const dispatch = createDispatcher();
const attrs = getAttrs("root");
$: pressed !== void 0 && localPressed.set(pressed);
$: updateOption("disabled", disabled);
$: builder = $root;
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
