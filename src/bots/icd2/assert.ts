/** Simple assertion library. */
export class Assert {
    /** Asserts that the value is NOT null. Can be overloaded to include type information. */
    public static isNotNull<T>(value: T, x?: T&any) {
        if (x === undefined) { x = { name: 'any' }; }
        if (value === null || value === undefined) {
            throw new Error(`Argument of type '${x.name}' cannot be null!`);
        }
    }
}
