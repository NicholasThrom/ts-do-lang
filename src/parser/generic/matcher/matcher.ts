/**
 * **abstract**, **immutable**
 *
 * Represents state in a infinite state automaton,
 * and holds the rest of infinite state automaton.
 *
 * In most use cases, this will resemble a finite state automata,
 * but, since states can be dynamically generated,
 * is more powerful and can represent some languages that are not regular.
 * (Theoretically it can match any computable language).
 *
 * The two most important properties are `afterStep` and `doesMatch`.
 *
 * **`afterStep`**
 *
 * Returns the `Matcher` that follows this given some input.
 * For example, if some `Matcher` will match the word "javascript",
 * the `afterStep` of "j" will be a `Matcher` that matches "avascript".
 *
 * ## **`doesMatch`**
 *
 * Returns whether the current `Matcher` is in a matching state.
 * For example, if some `Matcher` matches "t",
 * then the `afterStep` of "t" will be a `Matcher` that `doesMatch`.
 *
 * Matchers a similar to `RegExp`s, but have some main differences:
 * - They operate on any iterable, not just strings.
 * - They are easily extensible.
 * - They match non-regular languages.
 *
 * @param Type The type of the input to match against.
 */
abstract class Matcher<Type> {

    /**
     * **immutable**
     *
     * If this `Matcher` represents a match.
     *
     * The existence of this `Matcher` implies some descendant `Matcher` will
     * have a `doesMatch` of true.
     */
    public abstract readonly doesMatch: boolean;

    /**
     * **deterministic**,
     * **no side effects**
     *
     * Returns the next `Matcher` or `null`.
     *
     * If any further matches are impossible, `null` may be returned.
     * This is not guaranteed and must not be relied upon.
     * This may be used to quit early, or to improve readability.
     *
     * @param input The step to the next `Matcher`
     * @returns The next `Matcher`, or `null` if the match is over.
     */
    public abstract afterStep(input: Type): Matcher<Type> | null;

    /**
     * **deterministic**,
     * **no side effects**
     *
     * Convenience function for multiple steps.
     *
     * @param inputs The inputs over which to match.
     * @return ```
     *  {
     *      matcher
     */
    public afterSteps(inputs: Iterable<Type>): Matcher<Type> | null {
        let matcher: Matcher<Type> | null = this;

        for (const input of inputs) {
            if (matcher === null) { break; }
            matcher = matcher.afterStep(input);
        }

        return matcher;
    }

}

export { Matcher };
