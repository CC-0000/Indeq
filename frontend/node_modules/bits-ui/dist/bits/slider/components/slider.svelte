<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let disabled = void 0;
export let min = void 0;
export let max = void 0;
export let step = void 0;
export let orientation = void 0;
export let dir = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root, ticks, thumbs },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setCtx({
  disabled,
  dir,
  min,
  max,
  step,
  orientation,
  defaultValue: value,
  onValueChange: ({ next }) => {
    if (value !== next) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  }
});
const attrs = getAttrs("root");
$: value !== void 0 && localValue.set(value);
$: updateOption("disabled", disabled);
$: updateOption("min", min);
$: updateOption("max", max);
$: updateOption("step", step);
$: updateOption("orientation", orientation);
$: updateOption("dir", dir);
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} ticks={$ticks} thumbs={$thumbs} />
{:else}
	<span bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} ticks={$ticks} thumbs={$thumbs} />
	</span>
{/if}
