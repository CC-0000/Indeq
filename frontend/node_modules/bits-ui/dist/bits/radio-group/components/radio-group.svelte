<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let required = void 0;
export let disabled = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let loop = void 0;
export let orientation = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setCtx({
  required,
  disabled,
  defaultValue: value,
  loop,
  orientation,
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
$: updateOption("required", required);
$: updateOption("disabled", disabled);
$: updateOption("loop", loop);
$: updateOption("orientation", orientation);
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
