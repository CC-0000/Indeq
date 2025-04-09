<script>import { melt } from "@melt-ui/svelte";
import { getImage } from "../ctx.js";
export let src = void 0;
export let alt = void 0;
export let asChild = false;
export let el = void 0;
const attrs = {
  "data-bits-avatar-image": ""
};
$: image = getImage(src).elements.image;
$: builder = $image;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<img bind:this={el} {...builder} use:builder.action {alt} {...$$restProps} />
{/if}
