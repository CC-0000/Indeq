/**
 * Santizes an array of classnames by removing any empty strings.
 */
export function sanitizeClassNames(classNames) {
    return classNames.filter((className) => className.length > 0);
}
