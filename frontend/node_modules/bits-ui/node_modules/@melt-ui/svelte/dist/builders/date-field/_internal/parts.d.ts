export declare const DATE_SEGMENT_PARTS: readonly ["day", "month", "year"];
export declare const TIME_SEGMENT_PARTS: readonly ["hour", "minute", "second", "dayPeriod"];
export declare const NON_EDITABLE_SEGMENT_PARTS: readonly ["literal", "timeZoneName"];
export declare const EDITABLE_SEGMENT_PARTS: readonly ["day", "month", "year", "hour", "minute", "second", "dayPeriod"];
export declare const ALL_SEGMENT_PARTS: readonly ["day", "month", "year", "hour", "minute", "second", "dayPeriod", "literal", "timeZoneName"];
export declare const ALL_EXCEPT_LITERAL_PARTS: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod" | "literal" | "timeZoneName")[];
