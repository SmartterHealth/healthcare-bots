/**
 * Converts the value to a boolean.
 * @param value The value to convert.
 * @param defaultValue The default value if the value cannot be coerced to a boolean.
 */
export function convertToBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    return (value !== undefined && value !== null && (value.toLowerCase() === 'true' || value == '1'));
}

/**
 * Converts the value to an integer.
 * @param value The value to convert.
 * @param defaultValue The default value if the value cannot be coerced to an integer.
 */
export function convertToInteger(value: string | undefined, defaultValue: number = 0) {
    let newValue = defaultValue;

    if (value !== undefined && value !== null) {
        try {
            // tslint:disable-next-line:radix
            newValue = parseInt('' + value);
        } catch (err) {
            newValue = defaultValue;
        }
    }

    return newValue;
}
