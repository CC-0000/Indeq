<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  helpers: { isChecked, isIndeterminate },
  states: { checked },
  getAttrs
} = getCtx();
function getStateAttr(state) {
  if (state === "indeterminate") return "indeterminate";
  if (state) return "checked";
  return "unchecked";
}
$: attrs = {
  ...getAttrs("indicator"),
  "data-state": getStateAttr($checked)
};
</script>

{#if asChild}
	<slot {attrs} isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
	</div>
{/if}
