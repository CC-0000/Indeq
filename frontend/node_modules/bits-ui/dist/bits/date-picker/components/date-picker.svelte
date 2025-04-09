<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let portal = void 0;
export let open = void 0;
export let onOpenChange = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let placeholder = void 0;
export let onPlaceholderChange = void 0;
export let disabled = void 0;
export let isDateUnavailable = void 0;
export let granularity = void 0;
export let hideTimeZone = void 0;
export let hourCycle = void 0;
export let locale = void 0;
export let maxValue = void 0;
export let minValue = void 0;
export let readonly = void 0;
export let validationId = void 0;
export let descriptionId = void 0;
export let preventDeselect = void 0;
export let pagedNavigation = void 0;
export let weekStartsOn = void 0;
export let isDateDisabled = void 0;
export let fixedWeeks = void 0;
export let calendarLabel = void 0;
export let weekdayFormat = void 0;
export let numberOfMonths = void 0;
export let onOutsideClick = void 0;
const {
  states: {
    open: localOpen,
    value: localValue,
    placeholder: localPlaceholder,
    isInvalid: localIsInvalid
  },
  updateOption,
  ids
} = setCtx({
  defaultOpen: open,
  defaultValue: value,
  defaultPlaceholder: placeholder,
  preventDeselect,
  pagedNavigation,
  weekStartsOn,
  isDateDisabled,
  fixedWeeks,
  calendarLabel,
  disabled,
  granularity,
  hideTimeZone,
  hourCycle,
  locale,
  maxValue,
  minValue,
  readonly,
  weekdayFormat,
  numberOfMonths,
  isDateUnavailable,
  onOutsideClick,
  onValueChange: ({ next }) => {
    if (value !== next) {
      onValueChange?.(next);
      value = next;
    }
    return next;
  },
  onPlaceholderChange: ({ next }) => {
    if (placeholder !== next) {
      onPlaceholderChange?.(next);
      placeholder = next;
    }
    return next;
  },
  onOpenChange: ({ next }) => {
    if (open !== next) {
      onOpenChange?.(next);
      open = next;
    }
    return next;
  }
});
const idValues = derived(
  [
    ids.dateField.day,
    ids.dateField.description,
    ids.dateField.dayPeriod,
    ids.dateField.field,
    ids.dateField.hour,
    ids.dateField.minute,
    ids.dateField.month,
    ids.dateField.second,
    ids.dateField.year,
    ids.dateField.validation,
    ids.dateField.label,
    ids.dateField.timeZoneName,
    ids.calendar.calendar,
    ids.popover.content,
    ids.popover.trigger
  ],
  ([
    $dayId,
    $descriptionId,
    $dayPeriodId,
    $fieldId,
    $hourId,
    $minuteId,
    $monthId,
    $secondId,
    $yearId,
    $validationId,
    $labelId,
    $timeZoneNameId,
    $calendarId,
    $contentId
  ]) => ({
    day: $dayId,
    description: $descriptionId,
    dayPeriod: $dayPeriodId,
    field: $fieldId,
    hour: $hourId,
    minute: $minuteId,
    month: $monthId,
    second: $secondId,
    year: $yearId,
    validation: $validationId,
    label: $labelId,
    timeZoneName: $timeZoneNameId,
    calendar: $calendarId,
    content: $contentId
  })
);
$: if (validationId) {
  ids.dateField.validation.set(validationId);
}
$: if (descriptionId) {
  ids.dateField.description.set(descriptionId);
}
$: value !== $localValue && localValue.set(value);
$: placeholder !== void 0 && localPlaceholder.set(placeholder);
$: open !== void 0 && localOpen.set(open);
$: updateOption("disabled", disabled);
$: updateOption("isDateUnavailable", isDateUnavailable);
$: updateOption("granularity", granularity);
$: updateOption("hideTimeZone", hideTimeZone);
$: updateOption("hourCycle", hourCycle);
$: updateOption("locale", locale);
$: updateOption("maxValue", maxValue);
$: updateOption("minValue", minValue);
$: updateOption("readonly", readonly);
$: updateOption("fixedWeeks", fixedWeeks);
$: updateOption("preventDeselect", preventDeselect);
$: updateOption("pagedNavigation", pagedNavigation);
$: updateOption("weekStartsOn", weekStartsOn);
$: updateOption("isDateDisabled", isDateDisabled);
$: updateOption("calendarLabel", calendarLabel);
$: updateOption("weekdayFormat", weekdayFormat);
$: updateOption("numberOfMonths", numberOfMonths);
$: updateOption("onOutsideClick", onOutsideClick);
$: updateOption("portal", portal);
</script>

<slot ids={$idValues} isInvalid={$localIsInvalid} />
