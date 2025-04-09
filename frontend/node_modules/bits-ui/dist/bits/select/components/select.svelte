<script context="module"></script>

<script generics="T, Multiple extends boolean = false">import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
import { arraysAreEqual } from "../../../internal/arrays.js";
export let required = void 0;
export let disabled = void 0;
export let preventScroll = void 0;
export let loop = void 0;
export let closeOnEscape = void 0;
export let closeOnOutsideClick = void 0;
export let portal = void 0;
export let name = void 0;
export let multiple = false;
export let selected = void 0;
export let onSelectedChange = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let items = [];
export let onOutsideClick = void 0;
export let typeahead = void 0;
const {
  states: { open: localOpen, selected: localSelected },
  updateOption,
  ids
} = setCtx({
  required,
  disabled,
  preventScroll,
  loop,
  closeOnEscape,
  closeOnOutsideClick,
  portal,
  name,
  onOutsideClick,
  multiple,
  forceVisible: true,
  defaultSelected: Array.isArray(selected) ? [...selected] : selected,
  defaultOpen: open,
  onSelectedChange: ({ next }) => {
    if (Array.isArray(next)) {
      if (!Array.isArray(selected) || !arraysAreEqual(selected, next)) {
        onSelectedChange?.(next);
        selected = next;
        return next;
      }
      return next;
    }
    if (selected !== next) {
      onSelectedChange?.(next);
      selected = next;
    }
    return next;
  },
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  },
  items,
  typeahead
});
const idValues = derived(
  [ids.menu, ids.trigger, ids.label],
  ([$menuId, $triggerId, $labelId]) => ({
    menu: $menuId,
    trigger: $triggerId,
    label: $labelId
  })
);
$: open !== void 0 && localOpen.set(open);
$: selected !== void 0 && localSelected.set(
  Array.isArray(selected) ? [...selected] : selected
);
$: updateOption("required", required);
$: updateOption("disabled", disabled);
$: updateOption("preventScroll", preventScroll);
$: updateOption("loop", loop);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
$: updateOption("portal", portal);
$: updateOption("name", name);
$: updateOption("multiple", multiple);
$: updateOption("onOutsideClick", onOutsideClick);
$: updateOption("typeahead", typeahead);
</script>

<slot ids={$idValues} />
