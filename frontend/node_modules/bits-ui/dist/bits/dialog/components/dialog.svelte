<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let preventScroll = void 0;
export let closeOnEscape = void 0;
export let closeOnOutsideClick = void 0;
export let portal = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let openFocus = void 0;
export let closeFocus = void 0;
export let onOutsideClick = void 0;
const {
  states: { open: localOpen },
  updateOption,
  ids
} = setCtx({
  closeOnEscape,
  preventScroll,
  closeOnOutsideClick,
  portal,
  forceVisible: true,
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
  }
});
const idValues = derived(
  [ids.content, ids.description, ids.title],
  ([$contentId, $descriptionId, $titleId]) => ({
    content: $contentId,
    description: $descriptionId,
    title: $titleId
  })
);
$: open !== void 0 && localOpen.set(open);
$: updateOption("preventScroll", preventScroll);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
$: updateOption("portal", portal);
$: updateOption("openFocus", openFocus);
$: updateOption("closeFocus", closeFocus);
$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
