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

    describe(".steps()", function () {

        it("should call `.step` on the `Matcher` for each entry.", function () {
            const matcher = new (class extends Matcher<number> {
                public readonly doesMatch = true; // Irrelevant.
                public step() { return this; }
            })();
            const stepSpy = sandbox.spy(matcher, "step");
            const input = [1, 2, 3];

            matcher.steps(input);

            assert.strictEqual(stepSpy.callCount, input.length);
        });

        it("should call `.step` with the correct argument.", function () {
            const matcher = new (class extends Matcher<number> {
                public readonly doesMatch = true; // Irrelevant.
                public step() { return this; }
            })();
            const stepSpy = sandbox.spy(matcher, "step");
            const input = [1, 2, 3];

            matcher.steps(input);

            assert.strictEqual(stepSpy.firstCall.args[0], input[0]);
            assert.strictEqual(stepSpy.secondCall.args[0], input[1]);
            assert.strictEqual(stepSpy.thirdCall.args[0], input[2]);
        });

        it("should return the last `Matcher` matched.", function () {
            const stringToMatch = "any string of sufficient length";
            // There should be a few fewer `Matcher`s than the string is long,
            // so the `Matcher` chain ends before the `stringToMatch` does.
            const numberOfMatchers = stringToMatch.length - 3;
            const lastMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public step() { return null; }
            })();
            // Builds a chain of `Matcher`s of length `numberOfMatchers`.
            let matcher: Matcher<string> = lastMatcher;
            for (let i = 0; i < numberOfMatchers - 1; i++) {
                matcher = new (class extends Matcher<string> {
                    public constructor(private readonly matcher: Matcher<string>) { super(); }
                    public readonly doesMatch = true;
                    public step(input: string) { return this.matcher; }
                })(matcher);
            }

            const result = matcher.steps(stringToMatch);

            assert.strictEqual(result.matcher, lastMatcher);
        });

        it("should return the `index` of the failing input.", function () {
            const input1 = [true, true, true, true, false, true, false];
            const input2 = [true, true, false, true];
            const input3 = [false, true, true, false, true, true];
            const matcher = new (class extends Matcher<boolean> {
                public readonly doesMatch = true;
                public step(input: boolean) { return input ? this : null; }
            })();

            const result1 = matcher.steps(input1);
            const result2 = matcher.steps(input2);
            const result3 = matcher.steps(input3);

            assert.strictEqual(result1.index, input1.indexOf(false));
            assert.strictEqual(result2.index, input2.indexOf(false));
            assert.strictEqual(result3.index, input3.indexOf(false));
        });

        it("should return the length of the input if nothing fails.", function () {
            const input = [1, 2, 3, 4, 5, 6, 7];
            const matcher = new (class extends Matcher<number> {
                public readonly doesMatch = true;
                public step(input: number) { return this; }
            })();

            const result = matcher.steps(input);

            assert.strictEqual(result.index, input.length);
        });

    });

});
