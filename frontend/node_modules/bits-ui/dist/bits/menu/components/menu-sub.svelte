<script>import { derived } from "svelte/store";
import { setSubMenuCtx } from "../ctx.js";
export let disabled = void 0;
export let open = void 0;
export let onOpenChange = void 0;
const {
  updateOption,
  ids,
  states: { subOpen }
} = setSubMenuCtx({
  disabled,
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  }
});
const idValues = derived([ids.menu, ids.trigger], ([$menuId, $triggerId]) => ({
  menu: $menuId,
  trigger: $triggerId
}));
$: open !== void 0 && subOpen.set(open);
$: updateOption("disabled", disabled);
</script>

<slot subIds={$idValues} />
