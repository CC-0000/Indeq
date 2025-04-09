<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  states: { checked },
  getAttrs
} = getCtx();
$: attrs = {
  ...getAttrs("thumb"),
  "data-state": $checked ? "checked" : "unchecked",
  "data-checked": $checked ? "" : void 0
};
</script>

{#if asChild}
	<slot {attrs} checked={$checked} />
{:else}
	<span bind:this={el} {...$$restProps} {...attrs}></span>
{/if}
