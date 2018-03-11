import { assert } from "chai";
import "mocha";
import { sandbox as sandboxFactory } from "sinon";
const sandbox = sandboxFactory.create();

// Subject
import { Matcher } from "parser/generic/matcher/matcher";

describe("parser/generic/matcher/matcher", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist.", function () {
        assert(Matcher);
    });

    it("should support `instanceof Matcher`.", function () {
        const matcher = new (class extends Matcher<string> {
            public readonly doesMatch = true;
            public afterStep() { return this; }
        })();

        assert.isTrue(matcher instanceof Matcher);
    });

    describe(".afterSteps()", function () {

        it("should call `.afterStep` on the `Matcher` for each entry.", function () {
            const matcher = new (class extends Matcher<number> {
                public readonly doesMatch = true;
                public afterStep() { return this; }
            })();
            const afterStepSpy = sandbox.spy(matcher, "afterStep");
            const input = [1, 2, 3];

            matcher.afterSteps(input);

            assert.strictEqual(afterStepSpy.callCount, input.length);
        });

        it("should call `.afterStep` with the correct argument.", function () {
            const matcher = new (class extends Matcher<number> {
                public readonly doesMatch = true;
                public afterStep() { return this; }
            })();
            const afterStepSpy = sandbox.spy(matcher, "afterStep");
            const input = [1, 2, 3];

            matcher.afterSteps(input);

            assert.strictEqual(afterStepSpy.firstCall.args[0], input[0]);
            assert.strictEqual(afterStepSpy.secondCall.args[0], input[1]);
            assert.strictEqual(afterStepSpy.thirdCall.args[0], input[2]);
        });

        it("should return null if the `Matcher` chain ends.", function () {
            const stringToMatch = "any string of sufficient length";
            const numberOfMatchers = stringToMatch.length;
            const lastMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public afterStep() { return null; }
            })();
            // Builds a chain of `Matcher`s of length `numberOfMatchers`.
            let matcher: Matcher<string> = lastMatcher;
            for (let i = 0; i < numberOfMatchers - 1; i++) {
                matcher = new (class extends Matcher<string> {
                    public constructor(private readonly matcher: Matcher<string>) { super(); }
                    public readonly doesMatch = true;
                    public afterStep(input: string) { return this.matcher; }
                })(matcher);
            }

            const result = matcher.afterSteps(stringToMatch);

            assert.isNull(result);
        });

        it("should return the last `Matcher` if the input ends.", function () {
            const stringToMatch = "any string of sufficient length";
            const numberOfMatchers = stringToMatch.length + 1;
            const lastMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public afterStep() { return null; }
            })();
            // Builds a chain of `Matcher`s of length `numberOfMatchers`.
            let matcher: Matcher<string> = lastMatcher;
            for (let i = 0; i < numberOfMatchers - 1; i++) {
                matcher = new (class extends Matcher<string> {
                    public constructor(private readonly matcher: Matcher<string>) { super(); }
                    public readonly doesMatch = true;
                    public afterStep(input: string) { return this.matcher; }
                })(matcher);
            }

            const result = matcher.afterSteps(stringToMatch);

            assert.strictEqual(result, lastMatcher);
        });

    });

});
