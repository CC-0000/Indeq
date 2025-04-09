<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { label },
  ids,
  getAttrs
} = getCtx();
if (id) {
  ids.field.label.set(id);
}
const attrs = getAttrs("label");
$: builder = $label;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</span>
{/if}
