import { Matcher } from "parser/generic/matcher/matcher";

/**
 * Represents a `Matcher` that `.doesMatch` whenever any of the `.matchers` do.
 *
 * `.afterStep` may return a single `Matcher` if there is only one viable `Matcher`
 * left.
 */
class InclusiveOrMatcher<Type> extends Matcher<Type> {

    /** @inheritDoc */
    public readonly doesMatch: boolean;

    /**
     * The `Matcher`s of which this `InclusiveOrMatcher` represents the
     * inclusive or.
     */
    public readonly matchers: Array<Matcher<Type>>;

    /**
     * Constructs a `InclusiveOrMatcher` with the specified `matchers`.
     *
     * @param matchers The `Matcher`s to be combined. If `matchers.length` is
     *      less than or equal to `1`, this `InclusiveOrMatcher` would be better
     *      represented as a single `Matcher` or null.
     */
    public constructor(...matchers: Array<Matcher<Type>>) {
        super();
        this.matchers = matchers;
        this.doesMatch = this.matchers.some((matcher) => matcher.doesMatch);
    }

    /** @inheritDoc */
    public afterStep(input: Type): Matcher<Type> | null {
        const newMatchers: Array<Matcher<Type>> = this.matchers
            .map((matcher) => matcher.afterStep(input))
            .filter((matcher): matcher is Matcher<Type> => matcher !== null);

        switch (newMatchers.length) {
            case 0: return null;
            case 1: return newMatchers[0];
            default: return new InclusiveOrMatcher<Type>(...newMatchers);
        }
    }
}

export { InclusiveOrMatcher };
