<script>import { derived } from "svelte/store";
import { setMenuCtx } from "../ctx.js";
export let closeOnOutsideClick = void 0;
export let closeOnEscape = void 0;
export let portal = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let loop = void 0;
export let dir = void 0;
export let typeahead = void 0;
export let closeFocus = void 0;
export let disableFocusFirstItem = void 0;
export let closeOnItemClick = void 0;
export let onOutsideClick = void 0;
const {
  states: { open: localOpen },
  updateOption,
  ids
} = setMenuCtx({
  closeOnOutsideClick,
  closeOnEscape,
  portal,
  loop,
  dir,
  typeahead,
  closeFocus,
  disableFocusFirstItem,
  closeOnItemClick,
  onOutsideClick,
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
$: open !== void 0 && localOpen.set(open);
$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("portal", portal);
$: updateOption("loop", loop);
$: updateOption("dir", dir);
$: updateOption("closeFocus", closeFocus);
$: updateOption("disableFocusFirstItem", disableFocusFirstItem);
$: updateOption("typeahead", typeahead);
$: updateOption("closeOnItemClick", closeOnItemClick);
$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot menuIds={$idValues} />
