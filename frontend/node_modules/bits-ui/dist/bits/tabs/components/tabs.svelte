<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let orientation = void 0;
export let activateOnFocus = void 0;
export let loop = void 0;
export let autoSet = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setCtx({
  orientation,
  activateOnFocus,
  loop,
  autoSet,
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
$: updateOption("orientation", orientation);
$: updateOption("activateOnFocus", activateOnFocus);
$: updateOption("loop", loop);
$: updateOption("autoSet", autoSet);
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} value={$localValue} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} value={$localValue} />
	</div>
{/if}
