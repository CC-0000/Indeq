<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let disableFocusTrap = void 0;
export let closeOnEscape = void 0;
export let closeOnOutsideClick = void 0;
export let preventScroll = void 0;
export let portal = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let openFocus = void 0;
export let closeFocus = void 0;
export let onOutsideClick = void 0;
const {
  updateOption,
  states: { open: localOpen },
  ids
} = setCtx({
  disableFocusTrap,
  closeOnEscape,
  closeOnOutsideClick,
  preventScroll,
  portal,
  defaultOpen: open,
  openFocus,
  closeFocus,
  onOutsideClick,
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  },
  positioning: {
    gutter: 0,
    offset: {
      mainAxis: 1
    }
  }
});
const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({
  content: $contentId,
  trigger: $triggerId
}));
$: open !== void 0 && localOpen.set(open);
$: updateOption("disableFocusTrap", disableFocusTrap);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
$: updateOption("preventScroll", preventScroll);
$: updateOption("portal", portal);
$: updateOption("openFocus", openFocus);
$: updateOption("closeFocus", closeFocus);
$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
