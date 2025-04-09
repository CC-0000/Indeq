<script>import { setCtx } from "../ctx.js";
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
const {
  states: { value: localValue, placeholder: localPlaceholder, isInvalid: localIsInvalid },
  updateOption
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
</script>

<slot isInvalid={$localIsInvalid} />
