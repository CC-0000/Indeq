<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
import { arraysAreEqual } from "../../../internal/arrays.js";
export let multiple = false;
export let value = void 0;
export let onValueChange = void 0;
export let disabled = false;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setCtx({
  multiple,
  disabled,
  defaultValue: value,
  onValueChange: ({ next }) => {
    if (Array.isArray(next)) {
      if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
        onValueChange?.(next);
        value = next;
        return next;
      }
      return next;
    }
    if (value !== next) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  }
});
const attrs = getAttrs("root");
$: value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
$: updateOption("multiple", multiple);
$: updateOption("disabled", disabled);
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
