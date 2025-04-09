<script>import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
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
export let readonlySegments = void 0;
const {
  states: { value: localValue, placeholder: localPlaceholder, isInvalid: localIsInvalid },
  updateOption,
  ids
} = setCtx({
  defaultValue: value,
  defaultPlaceholder: placeholder,
  disabled,
  granularity,
  hideTimeZone,
  hourCycle,
  locale,
  maxValue,
  minValue,
  readonly,
  isDateUnavailable,
  readonlySegments,
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
  }
});
const startIdValues = derived(
  [
    ids.start.day,
    ids.start.description,
    ids.start.dayPeriod,
    ids.start.hour,
    ids.start.minute,
    ids.start.month,
    ids.start.second,
    ids.start.year,
    ids.start.validation,
    ids.start.label,
    ids.start.timeZoneName
  ],
  ([
    $dayId,
    $descriptionId,
    $dayPeriodId,
    $hourId,
    $minuteId,
    $monthId,
    $secondId,
    $yearId,
    $validationId,
    $labelId,
    $timeZoneNameId
  ]) => ({
    day: $dayId,
    description: $descriptionId,
    dayPeriod: $dayPeriodId,
    hour: $hourId,
    minute: $minuteId,
    month: $monthId,
    second: $secondId,
    year: $yearId,
    validation: $validationId,
    label: $labelId,
    timeZoneName: $timeZoneNameId
  })
);
const endIdValues = derived(
  [
    ids.end.day,
    ids.end.description,
    ids.end.dayPeriod,
    ids.end.hour,
    ids.end.minute,
    ids.end.month,
    ids.end.second,
    ids.end.year,
    ids.end.validation,
    ids.end.label,
    ids.end.timeZoneName
  ],
  ([
    $dayId,
    $descriptionId,
    $dayPeriodId,
    $hourId,
    $minuteId,
    $monthId,
    $secondId,
    $yearId,
    $validationId,
    $labelId,
    $timeZoneNameId
  ]) => ({
    day: $dayId,
    description: $descriptionId,
    dayPeriod: $dayPeriodId,
    hour: $hourId,
    minute: $minuteId,
    month: $monthId,
    second: $secondId,
    year: $yearId,
    validation: $validationId,
    label: $labelId,
    timeZoneName: $timeZoneNameId
  })
);
const fieldIdValues = derived(
  [ids.field.description, ids.field.field, ids.field.label, ids.field.validation],
  ([$descriptionId, $fieldId, $labelId, $validationId]) => ({
    description: $descriptionId,
    field: $fieldId,
    label: $labelId,
    validation: $validationId
  })
);
$: if (descriptionId) {
  ids.field.description.set(descriptionId);
}
$: if (validationId) {
  ids.field.validation.set(validationId);
}
$: value !== void 0 && localValue.set(value);
$: placeholder !== void 0 && localPlaceholder.set(placeholder);
$: updateOption("disabled", disabled);
$: updateOption("isDateUnavailable", isDateUnavailable);
$: updateOption("granularity", granularity);
$: updateOption("hideTimeZone", hideTimeZone);
$: updateOption("hourCycle", hourCycle);
$: updateOption("locale", locale);
$: updateOption("maxValue", maxValue);
$: updateOption("minValue", minValue);
$: updateOption("readonly", readonly);
$: updateOption("readonlySegments", readonlySegments);
$: idSlotProp = {
  start: $startIdValues,
  end: $endIdValues,
  field: $fieldIdValues
};
</script>

<slot isInvalid={$localIsInvalid} ids={idSlotProp} />
