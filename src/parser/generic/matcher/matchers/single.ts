import { Matcher } from "parser/generic/matcher/matcher";

import { FinalMatcher } from "parser/generic/matcher/matchers/final";

class SingleMatcher<Type> extends Matcher<Type> {

    /**
     * Constructs a `SingleMatcher` with the specified `isAccepted` function.
     *
     * @param isAccepted
     *      A function that takes as `input` a `Type` and returns a `boolean`
     *      indicating if the `input` is acceptable.
     *
     *      Must be pure and deterministic.
     */
    public constructor(private readonly isAccepted: (input: Type) => boolean) {
        super();
    }

    /**
     * A convenience method.
     *
     * Constructs a `SingleMatcher` that matches only the specified `input`.
     *
     * Matches through strict equality.
     *
     * @param input The only value that the constructed `SingleMatcher` accepts.
     */
    public static for<Type>(input: Type) {
        return new SingleMatcher<Type>((innerInput) => innerInput === input);
    }

    /** @inheritDoc */
    public doesMatch = false;

    /** @inheritDoc */
    public afterStep(input: Type): Matcher<Type> | null {
        return this.isAccepted(input) ? new FinalMatcher<Type>() : null;
    }

}

export { SingleMatcher };
