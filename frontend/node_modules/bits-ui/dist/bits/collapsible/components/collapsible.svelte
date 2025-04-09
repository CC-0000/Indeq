<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let disabled = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { open: localOpen },
  updateOption,
  getAttrs
} = setCtx({
  disabled,
  forceVisible: true,
  defaultOpen: open,
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  }
});
const attrs = getAttrs("root");
$: open !== void 0 && localOpen.set(open);
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
