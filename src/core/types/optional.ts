/**
 * Make some property optional on type
 *
 * @example
 * type Foo = {
 *  a: string
 *  b: number
 * }
 *
 * type FooWithOptionalA = Optional<Foo, 'a'>
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
