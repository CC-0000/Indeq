<script>import { melt } from "@melt-ui/svelte";
import { setGroupCtx } from "../ctx.js";
import { arraysAreEqual } from "../../../internal/arrays.js";
export let type = "single";
export let disabled = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { group },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setGroupCtx({
  disabled,
  type,
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
const attrs = getAttrs("group");
$: value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
$: updateOption("disabled", disabled);
$: updateOption("type", type);
$: builder = $group;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
