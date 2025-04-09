<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let open = void 0;
export let onOpenChange = void 0;
export let portal = void 0;
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
export let startValue = void 0;
export let numberOfMonths = void 0;
export let onOutsideClick = void 0;
const {
  states: {
    open: localOpen,
    value: localValue,
    placeholder: localPlaceholder,
    isInvalid: localIsInvalid,
    startValue: localStartValue,
    endValue: localEndValue
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
  portal,
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
const startFieldIds = derived(
  [
    ids.rangeField.start.day,
    ids.rangeField.start.dayPeriod,
    ids.rangeField.start.field,
    ids.rangeField.start.hour,
    ids.rangeField.start.minute,
    ids.rangeField.start.month,
    ids.rangeField.start.second,
    ids.rangeField.start.year,
    ids.rangeField.start.timeZoneName
  ],
  ([
    $dayId,
    $dayPeriodId,
    $hourId,
    $minuteId,
    $monthId,
    $secondId,
    $yearId,
    $timeZoneNameId
  ]) => ({
    day: $dayId,
    dayPeriod: $dayPeriodId,
    hour: $hourId,
    minute: $minuteId,
    month: $monthId,
    second: $secondId,
    year: $yearId,
    timeZoneName: $timeZoneNameId
  })
);
const endFieldIds = derived(
  [
    ids.rangeField.end.day,
    ids.rangeField.end.dayPeriod,
    ids.rangeField.end.field,
    ids.rangeField.end.hour,
    ids.rangeField.end.minute,
    ids.rangeField.end.month,
    ids.rangeField.end.second,
    ids.rangeField.end.year,
    ids.rangeField.end.timeZoneName
  ],
  ([
    $dayId,
    $dayPeriodId,
    $hourId,
    $minuteId,
    $monthId,
    $secondId,
    $yearId,
    $timeZoneNameId
  ]) => ({
    day: $dayId,
    dayPeriod: $dayPeriodId,
    hour: $hourId,
    minute: $minuteId,
    month: $monthId,
    second: $secondId,
    year: $yearId,
    timeZoneName: $timeZoneNameId
  })
);
const idValues = derived(
  [
    ids.rangeField.field.field,
    ids.rangeField.field.description,
    ids.rangeField.field.label,
    ids.rangeField.field.validation,
    ids.calendar.calendar,
    ids.popover.content,
    ids.popover.trigger,
    startFieldIds,
    endFieldIds
  ],
  ([
    $fieldId,
    $descriptionId,
    $labelId,
    $validationId,
    $calendarId,
    $contentId,
    $triggerId,
    $startFieldIds,
    $endFieldIds
  ]) => ({
    field: $fieldId,
    description: $descriptionId,
    label: $labelId,
    validation: $validationId,
    calendar: $calendarId,
    content: $contentId,
    trigger: $triggerId,
    startField: $startFieldIds,
    endField: $endFieldIds
  })
);
$: if (validationId) {
  ids.rangeField.field.validation.set(validationId);
}
$: if (descriptionId) {
  ids.rangeField.field.description.set(descriptionId);
}
$: startValue = $localStartValue;
$: if (value !== $localValue) {
  const nextValue = { start: value?.start, end: value?.end };
  if (nextValue.start !== $localStartValue) localStartValue.set(nextValue.start);
  if (nextValue.end !== $localEndValue) localEndValue.set(nextValue.end);
  localValue.set(nextValue);
}
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

<slot
	ids={$idValues}
	isInvalid={$localIsInvalid}
	startValue={$localStartValue}
	endValue={$localEndValue}
/>
