<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let open = void 0;
export let onOpenChange = void 0;
export let openDelay = 700;
export let closeDelay = 300;
export let closeOnOutsideClick = void 0;
export let closeOnEscape = void 0;
export let portal = void 0;
export let onOutsideClick = void 0;
const {
  states: { open: localOpen },
  updateOption,
  ids
} = setCtx({
  defaultOpen: open,
  openDelay,
  closeDelay,
  closeOnOutsideClick,
  closeOnEscape,
  portal,
  onOutsideClick,
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  }
});
const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({
  content: $contentId,
  trigger: $triggerId
}));
$: open !== void 0 && localOpen.set(open);
$: updateOption("openDelay", openDelay);
$: updateOption("closeDelay", closeDelay);
$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("portal", portal);
$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
