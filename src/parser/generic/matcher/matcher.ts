/**
 * A finite state machine used to match against arbitrary series of data.
 *
 * Similar to the build in `RegExp` type but
 * - Matches things other than strings.
 * - Is more easily extensible.
 *
 * Usage:
 * ```
 * matcher.steps([new Type('a'), new Type('a'), new Type('a')]).doesMatch)
 * // Outputs `true` or `false`.
 * ```
 *
 * Note that the existence of a `Matcher` implies that some descendant `Matcher`
 * may match. If `matcher.step` puts the matcher into a state that will never
 * match, it should return `null`.
 *
 * @param Type The type of the input to match against.matcher.
 */
abstract class Matcher<Type> {

    /**
     * If this `Matcher` represents a match.
     *
     * The existence of this `Matcher` implies some descendant `Matcher` will
     * have a `doesMatch` of true.
     */
    public abstract readonly doesMatch: boolean;

    /**
     * Returns the next `Matcher` or `null`.
     *
     * If any further matches are impossible, `null` should be returned.
     * Otherwise, a new (or cached) `Matcher` should be returned.
     *
     * @param input The step to the next `Matcher`
     * @returns The next `Matcher`, or `null` if the match is over.
     */
    public abstract step(input: Type): Matcher<Type> | null;

    /**
     * Returns a map containing the final non-`null` `Matcher`, the index of
     * input that would result in the `Matcher` returning `null`, or the length
     * of the `inputs` array otherwise.
     *
     * @param inputs The inputs over which to match.
     * @return ```
     *  {
     *      matcher
     */
    public steps(inputs: Type[]): {
        matcher: Matcher<Type>,
        index: number;
    } {
        let index = 0;
        let matcher: Matcher<Type> = this;

        for (const input of inputs) {
            const next = this.step(input);
            if (!next) { break; }
            matcher = next;
            index += 1;
        }

        return { matcher, index };
    }

}

export { Matcher };
