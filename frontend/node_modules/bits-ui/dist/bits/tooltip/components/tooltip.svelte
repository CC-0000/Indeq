<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let closeOnEscape = void 0;
export let portal = void 0;
export let closeOnPointerDown = void 0;
export let openDelay = void 0;
export let closeDelay = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let disableHoverableContent = void 0;
export let group = void 0;
const {
  states: { open: localOpen },
  updateOption,
  ids
} = setCtx({
  closeOnEscape,
  portal,
  closeOnPointerDown,
  openDelay,
  closeDelay,
  forceVisible: true,
  defaultOpen: open,
  disableHoverableContent,
  group,
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
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("portal", portal);
$: updateOption("closeOnPointerDown", closeOnPointerDown);
$: updateOption("openDelay", openDelay);
$: updateOption("closeDelay", closeDelay);
$: updateOption("group", group);
$: updateOption("disableHoverableContent", disableHoverableContent);
</script>

<slot ids={$idValues} />
