<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
import SwitchInput from "./switch-input.svelte";
import { createDispatcher } from "../../../internal/events.js";
export let checked = void 0;
export let onCheckedChange = void 0;
export let disabled = void 0;
export let name = void 0;
export let value = void 0;
export let includeInput = true;
export let required = void 0;
export let asChild = false;
export let inputAttrs = void 0;
export let el = void 0;
const {
  elements: { root },
  states: { checked: localChecked },
  updateOption,
  getAttrs
} = setCtx({
  disabled,
  name,
  value,
  required,
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
$: checked !== void 0 && localChecked.set(checked);
$: updateOption("disabled", disabled);
$: updateOption("name", name);
$: updateOption("value", value);
$: updateOption("required", required);
$: builder = $root;
$: attrs = { ...getAttrs("root"), "data-checked": checked ? "" : void 0 };
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
{#if includeInput}
	<SwitchInput {...inputAttrs} />
{/if}
