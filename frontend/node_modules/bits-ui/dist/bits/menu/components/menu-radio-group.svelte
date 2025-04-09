<script>import { melt } from "@melt-ui/svelte";
import { setRadioGroupCtx } from "../ctx.js";
export let value = void 0;
export let onValueChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { radioGroup },
  states: { value: localValue },
  getAttrs
} = setRadioGroupCtx({
  defaultValue: value,
  onValueChange: ({ next }) => {
    if (next != null && next !== value) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  }
});
const attrs = getAttrs("radio-group");
$: value !== void 0 && localValue.set(value);
$: builder = $radioGroup;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
