<script>import { melt } from "@melt-ui/svelte";
import { onMount } from "svelte";
import { setCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
import { handleCalendarInitialFocus } from "../../../internal/focus.js";
import { arraysAreEqual } from "../../../internal/arrays.js";
export let placeholder = void 0;
export let onPlaceholderChange = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let preventDeselect = void 0;
export let minValue = void 0;
export let maxValue = void 0;
export let pagedNavigation = void 0;
export let weekStartsOn = void 0;
export let locale = void 0;
export let isDateUnavailable = void 0;
export let isDateDisabled = void 0;
export let disabled = void 0;
export let readonly = void 0;
export let fixedWeeks = void 0;
export let calendarLabel = void 0;
export let weekdayFormat = void 0;
export let multiple = false;
export let asChild = false;
export let id = void 0;
export let numberOfMonths = void 0;
export let initialFocus = false;
export let el = void 0;
onMount(() => {
  if (!initialFocus || !el) return;
  handleCalendarInitialFocus(el);
});
const {
  elements: { calendar },
  states: { value: localValue, placeholder: localPlaceholder, months: localMonths, weekdays },
  updateOption,
  ids,
  getCalendarAttrs
} = setCtx({
  defaultPlaceholder: placeholder,
  defaultValue: value,
  preventDeselect,
  minValue,
  maxValue,
  pagedNavigation,
  weekStartsOn,
  locale,
  isDateUnavailable,
  isDateDisabled,
  disabled,
  readonly,
  fixedWeeks,
  calendarLabel,
  weekdayFormat,
  multiple,
  numberOfMonths,
  onPlaceholderChange: ({ next }) => {
    if (placeholder !== next) {
      onPlaceholderChange?.(next);
      placeholder = next;
    }
    return next;
  },
  onValueChange: ({ next }) => {
    if (Array.isArray(next)) {
      if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
        onValueChange?.(next);
        value = next;
        return next;
      }
      return next;
    }
    if (value !== next) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  }
});
$: if (id) {
  ids.calendar.set(id);
}
$: value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
$: placeholder !== void 0 && localPlaceholder.set(placeholder);
$: updateOption("preventDeselect", preventDeselect);
$: updateOption("minValue", minValue);
$: updateOption("maxValue", maxValue);
$: updateOption("pagedNavigation", pagedNavigation);
$: updateOption("weekStartsOn", weekStartsOn);
$: updateOption("locale", locale);
$: updateOption("isDateUnavailable", isDateUnavailable);
$: updateOption("isDateDisabled", isDateDisabled);
$: updateOption("disabled", disabled);
$: updateOption("readonly", readonly);
$: updateOption("fixedWeeks", fixedWeeks);
$: updateOption("calendarLabel", calendarLabel);
$: updateOption("weekdayFormat", weekdayFormat);
$: updateOption("numberOfMonths", numberOfMonths);
const attrs = getCalendarAttrs("root");
$: builder = $calendar;
$: Object.assign(builder, attrs);
const dispatch = createDispatcher();
let months = $localMonths;
$: months = $localMonths;
</script>

{#if asChild}
	<slot {months} weekdays={$weekdays} {builder} />
{:else}
	<div {...builder} use:builder.action {...$$restProps} on:m-keydown={dispatch} bind:this={el}>
		<slot {months} weekdays={$weekdays} {builder} />
	</div>
{/if}
