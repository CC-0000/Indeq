<script>import { melt } from "@melt-ui/svelte";
import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let placeholder = void 0;
export let value = void 0;
export let name = void 0;
export let disabled = void 0;
export let type = "text";
export let onValueChange = void 0;
export let id = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { value: localValue },
  updateOption,
  ids,
  getAttrs
} = setCtx({
  placeholder,
  defaultValue: value,
  name,
  disabled,
  type,
  onValueChange: ({ next }) => {
    if (value !== next) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  }
});
$: value !== void 0 && localValue.set(value);
const attrs = getAttrs("root");
$: updateOption("placeholder", placeholder);
$: updateOption("name", name);
$: updateOption("disabled", disabled);
$: updateOption("type", type);
$: builder = $root;
$: Object.assign(builder, attrs);
const idValues = derived([ids.root], ([$menubarId]) => ({
  menubar: $menubarId
}));
$: if (id) {
  ids.root.set(id);
}
$: slotProps = {
  builder,
  ids: $idValues
};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {...slotProps} />
	</div>
{/if}
