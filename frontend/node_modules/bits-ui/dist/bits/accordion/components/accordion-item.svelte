<script>import { melt } from "@melt-ui/svelte";
import { setItem } from "../ctx.js";
export let value;
export let disabled = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { item },
  propsStore,
  getAttrs
} = setItem({ value, disabled });
const attrs = getAttrs("item");
$: propsStore.set({ value, disabled });
$: builder = $item({ ...$propsStore, disabled });
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
