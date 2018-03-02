
/**
 * A finite state machine used to match against arbitrary series of data.
 *
 * Similar to the build in `RegExp` type but
 * - Matches things other than strings.
 * - Can note different kinds of matches.
 *
 * Usage:
 * ```
 * matcher.steps([new Type('a'), new Type('a'), new Type('a')]).value)
 * // Outputs some `Value`.
 * ```
 *
 * @param Type The type of the input to match against.
 * @param Value The type that indicates the kind of match at this matcher.
 */
abstract class Matcher<Type, Value> {

    /**
     * The kind of match at this `Matcher`.
     *
     * If this `Matcher` is not a match, `null`.
     */
    public abstract readonly value: Value | null;

    /**
     * Returns the next `Matcher`, or `null` if the match is over.
     *
     * @param input The step to the next `Matcher`
     * @returns The next `Matcher`, or `null` if the match is over.
     */
    public abstract step(input: Type): this | null;

    /**
     * Returns a tuple containing the final `Matcher` and the index of the last
     * matched entry.
     *
     * @param inputs The inputs over which to match.
     */
    public steps(inputs: Type[]): [this, number] {

        let index = 0;
        let matcher = this;

        for (const input of inputs) {
            const next = this.step(input);
            if (!next) { break; }
            matcher = next;
            index += 1;
        }

        return [matcher, index];

    }

}

/**
 * Represents a `Matcher` that fails on any input. This is used as the end of
 * a `Matcher` chain.
 */
class MatcherFinal<Type, Value> extends Matcher<Type, Value> {

    /**
     * Constructs a `MatcherFinal`.
     *
     * @param value The value of this matcher.
     */
    public constructor(public readonly value: Value | null) {
        super();
    }

    /** @inheritDoc */
    public step(input: Type): this | null {
        return null;
    }

}

