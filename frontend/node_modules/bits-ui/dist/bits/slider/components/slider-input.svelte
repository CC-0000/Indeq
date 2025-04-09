<script>import { getCtx } from "../ctx.js";
import { getSrOnlyStyles } from "../../../internal/style.js";
export let el = void 0;
const {
  states: { value },
  getAttrs
} = getCtx();
function getValue(value2) {
  if (value2.length === 1) {
    return value2[0];
  } else if (value2.length === 2) {
    return value2[1] - value2[0];
  }
}
const attrs = {
  ...getAttrs("input"),
  style: getSrOnlyStyles()
};
$: inputValue = getValue($value);
</script>

<input bind:this={el} {...$$restProps} value={inputValue} {...attrs} />
