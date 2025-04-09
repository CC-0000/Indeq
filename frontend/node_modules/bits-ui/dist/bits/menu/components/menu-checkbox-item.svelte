<script>import { melt } from "@melt-ui/svelte";
import { setCheckboxItem } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let checked = void 0;
export let onCheckedChange = void 0;
export let disabled = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { checkboxItem },
  states: { checked: localChecked },
  updateOption,
  getAttrs
} = setCheckboxItem({
  disabled,
  defaultChecked: checked,
  onCheckedChange: ({ next }) => {
    if (checked !== next) {
      onCheckedChange?.(next);
      checked = next;
    }
    return next;
  }
});
const dispatch = createDispatcher();
const attrs = getAttrs("checkbox-item");
$: checked !== void 0 && localChecked.set(checked);
$: updateOption("disabled", disabled);
$: builder = $checkboxItem;
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
