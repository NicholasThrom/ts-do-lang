import { Matcher } from "../matcher";

/**
 * Represents a `Matcher` that fails on any input. This is used as the end of
 * a `Matcher` chain.
 */
class FinalMatcher<Type> extends Matcher<Type> {

    /**
     * Constructs a `FinalMatcher`. Since the behaviour is fixed, no parameters
     * need be supplied.
     */
    public constructor() { super(); }

    /** @inheritDoc */
    public readonly doesMatch = true;

    /** @inheritDoc */
    public step(input: Type): this | null {
        return null;
    }

}

export { FinalMatcher };
