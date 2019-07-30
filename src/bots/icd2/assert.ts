/** Simple assertion library. */
export class Assert {
    /** Asserts that the value is NOT null. Can be overloaded to include type information. */
    public static isNotNull<T>(value: T, x?: T&any) {
        if (x === undefined) { x = { name: 'any' }; }
        if (value === null || value === undefined) {
            throw new Error(`Argument of type '${x.name}' cannot be null!`);
        }
    }

    public static isNotNullOrBlank<T>(value: T, name?: string) {
        if (value === null || value === undefined) {
            throw new Error(`Value '${name}' cannot be null!`);
        }

        if (typeof value === 'string') {
            if ((value + '').trim().length === 0) {
                throw new Error(`Value '${name}' cannot be null!`);
            }
        }
    }
}
