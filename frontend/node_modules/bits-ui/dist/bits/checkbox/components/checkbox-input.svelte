<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let el = void 0;
const {
  elements: { input },
  options: { value }
} = getCtx();
</script>

<input bind:this={el} {...$input} use:$input.action value={$value ?? "on"} {...$$restProps} />
