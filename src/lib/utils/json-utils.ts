/**
 * JSON Utility Functions
 *
 * Helper functions for JSON manipulation, cleaning, and transformation.
 */

/**
 * Helper function to check if a value should be excluded (is "empty")
 * @param value - The value to check
 * @returns true if the value is considered empty
 */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (value === '') return true;
  if (value === false) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Deep merges two objects, filling in missing fields from defaults
 *
 * This function ensures that all nested fields from defaults are present in the result.
 * If a field exists in the source, it uses that value. If not, it uses the default.
 *
 * @param defaults - The default object with all required fields
 * @param source - The partial object to merge (may have missing fields)
 * @returns A complete object with all fields from defaults, overridden by source where present
 *
 * @example
 * ```typescript
 * const defaults = { a: 1, b: { c: 2, d: 3 } };
 * const source = { b: { c: 5 } };
 * deepMerge(defaults, source);
 * // Result: { a: 1, b: { c: 5, d: 3 } }
 * ```
 */
export function deepMergeWithDefaults<T>(defaults: T, source: Partial<T>): T {
  // Handle non-object cases
  if (source === null || source === undefined) {
    return defaults;
  }

  // If source is not an object (primitive), return source if it exists, otherwise defaults
  if (typeof source !== 'object' || typeof defaults !== 'object') {
    return source as T;
  }

  // Handle arrays - prefer source array if it exists, otherwise use defaults
  if (Array.isArray(defaults)) {
    return (Array.isArray(source) ? source : defaults) as T;
  }

  // Deep merge objects
  const result: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const defaultValue = (defaults as Record<string, unknown>)[key];
      const sourceValue = (source as Record<string, unknown>)[key];

      // If both are objects (and not arrays), recursively merge
      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        defaultValue !== null &&
        typeof defaultValue === 'object' &&
        !Array.isArray(defaultValue)
      ) {
        result[key] = deepMergeWithDefaults(defaultValue, sourceValue);
      } else {
        // Otherwise, use source value if it exists
        result[key] = sourceValue !== undefined ? sourceValue : defaultValue;
      }
    }
  }

  return result as T;
}

/**
 * Creates a minimal JSON by removing empty values
 * Removes null, undefined, empty strings, false, empty arrays, and empty objects
 *
 * This is useful for:
 * - Reducing file size when exporting form data
 * - Creating clean test fixtures
 * - API payloads where empty values should be omitted
 *
 * @param obj - The object to clean
 * @returns A new object with all empty values removed, or undefined if result is empty
 *
 * @example
 * ```typescript
 * const data = { name: 'John', age: 0, address: '', tags: [] };
 * createMinimalJSON(data); // { name: 'John', age: 0 }
 * ```
 */
export function createMinimalJSON(obj: unknown): unknown {
  // Handle arrays
  if (Array.isArray(obj)) {
    const filtered = obj.map(createMinimalJSON).filter(item => !isEmpty(item));
    return filtered.length > 0 ? filtered : undefined;
  }

  // Handle objects
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = createMinimalJSON(value);
      if (!isEmpty(cleaned)) {
        result[key] = cleaned;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  // Return primitives (strings, numbers, booleans, etc.)
  return obj;
}
