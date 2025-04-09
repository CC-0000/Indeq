<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let checked = false;
export let disabled = void 0;
export let name = void 0;
export let required = void 0;
export let value = void 0;
export let onCheckedChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { checked: localChecked },
  updateOption,
  getAttrs
} = setCtx({
  defaultChecked: checked,
  disabled,
  name,
  required,
  value,
  onCheckedChange: ({ next }) => {
    if (checked !== next) {
      onCheckedChange?.(next);
      checked = next;
    }
    return next;
  }
});
const dispatch = createDispatcher();
$: attrs = { ...getAttrs("root"), disabled: disabled ? true : void 0 };
$: checked !== void 0 && localChecked.set(checked);
$: updateOption("disabled", disabled);
$: updateOption("name", name);
$: updateOption("required", required);
$: updateOption("value", value);
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
