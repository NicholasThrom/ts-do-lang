import { assert } from "chai";
import "mocha";
import { sandbox as sandboxFactory } from "sinon";
const sandbox = sandboxFactory.create();

import { Matcher } from "parser/generic/matcher/matcher";

import { InclusiveOrMatcher } from "parser/generic/matcher/matchers/inclusiveOr";

describe("parser/generic/matcher/matchers/inclusiveOr", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist", function () {
        assert(InclusiveOrMatcher);
    });

    it("should support `instanceof InclusiveOrMatcher`", function () {
        const matcher = new InclusiveOrMatcher<number>();

        assert.isTrue(matcher instanceof InclusiveOrMatcher);
    });

    it("should support `instanceOf Matcher`", function () {
        const matcher = new InclusiveOrMatcher<number>();

        assert.isTrue(matcher instanceof Matcher);
    });

    describe(".doesMatch", function () {
        class TrueMatcher<Type> extends Matcher<Type> {
            public readonly doesMatch = true;
            public afterStep() { return this; }
        }

        class FalseMatcher<Type> extends Matcher<Type> {
            public readonly doesMatch = false;
            public afterStep() { return this; }
        }

        it("should be `true` if the first `Matcher` `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new TrueMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
            );

            assert.isTrue(matcher.doesMatch);
        });

        it("should be `true` if the last `Matcher` `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new TrueMatcher(),
            );

            assert.isTrue(matcher.doesMatch);
        });

        it("should be `true` if any `Matcher` `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new TrueMatcher(),
                new FalseMatcher(),
            );

            assert.isTrue(matcher.doesMatch);
        });

        it("should be `true` if all the `Matcher`s `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new TrueMatcher(),
                new TrueMatcher(),
                new TrueMatcher(),
            );

            assert.isTrue(matcher.doesMatch);
        });

        it("should be `true` if the only `Matcher` `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new TrueMatcher(),
            );

            assert.isTrue(matcher.doesMatch);
        });

        it("should be `false` if the none of the `Matcher`s `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
            );

            assert.isFalse(matcher.doesMatch);
        });

        it("should be `false` if the none of the `Matcher`s `.doesMatch`.", function () {
            const matcher = new InclusiveOrMatcher(
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
            );

            assert.isFalse(matcher.doesMatch);
        });

        it("should be `false` if there are no `Matcher`s.", function () {
            const matcher = new InclusiveOrMatcher(
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
                new FalseMatcher(),
            );

            assert.isFalse(matcher.doesMatch);
        });

    });

    describe(".afterStep", function () {

        it("should call `.afterStep` on each `Matcher`", function () {
            class ListeningMatcher<Type> extends Matcher<Type> {
                public constructor(private readonly listener: () => any) { super(); }
                public readonly doesMatch = true;
                public afterStep() {
                    this.listener();
                    return this;
                }
            }
            const spies = [sandbox.spy(), sandbox.spy(), sandbox.spy(), sandbox.spy(), sandbox.spy()];
            const matcher = new InclusiveOrMatcher<string>(
                ...spies.map((spy) => new ListeningMatcher<string>(spy)),
            );

            matcher.afterStep("any string");
            assert.isTrue(spies.every((spy) => spy.calledOnce));
        });

        it("should update `.matchers` accordingly`", function () {
            const nextMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public afterStep() { return this; }
            })();
            const currentMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = false;
                public afterStep() { return nextMatcher; }
            })();
            const matcher = new InclusiveOrMatcher<string>(currentMatcher, currentMatcher, currentMatcher);

            const result = matcher.afterStep("any string");

            assert(result instanceof InclusiveOrMatcher);
            // Since assert does not provide type information it is explicitly specified.
            assert.isTrue((result as InclusiveOrMatcher<string>).matchers.every((matcher) => matcher === nextMatcher));
        });

        it("should return a sub-`Matcher` if only one `Matcher` is non-`null`.", function () {
            const nullifyingMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public afterStep() { return null; }
            })();
            const nonNullifyingMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = false;
                public afterStep() { return this; }
            })();
            const matcher = new InclusiveOrMatcher<string>(
                nullifyingMatcher, nonNullifyingMatcher, nullifyingMatcher,
            );

            const result = matcher.afterStep("any string");

            assert.strictEqual(result, nonNullifyingMatcher);
        });

        it("should return `null` if no `Matcher`s are non-`null`.", function () {
            const nullifyingMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = true;
                public afterStep() { return null; }
            })();
            const matcher = new InclusiveOrMatcher<string>(
                nullifyingMatcher, nullifyingMatcher, nullifyingMatcher,
            );

            const result = matcher.afterStep("any string");

            assert.isNull(result);
        });

        it("should return a sub-`Matcher` if only one `Matcher` exists.", function () {
            const nonNullifyingMatcher = new (class extends Matcher<string> {
                public readonly doesMatch = false;
                public afterStep() { return this; }
            })();
            const matcher = new InclusiveOrMatcher<string>(nonNullifyingMatcher);

            const result = matcher.afterStep("any string");

            assert.strictEqual(result, nonNullifyingMatcher);
        });

        it("should return a sub-`Matcher` if no `Matcher`s exist.", function () {
            const matcher = new InclusiveOrMatcher<string>();

            const result = matcher.afterStep("any string");

            assert.isNull(result);
        });

    });

    describe(".matchers", function () {

        it("should equal `constructor` arguments.", function () {
            class PlainMatcher<Type> extends Matcher<Type> {
                public readonly doesMatch = false;
                public afterStep() { return this; }
            }
            const innerMatchers = [
                new PlainMatcher<string>(),
                new PlainMatcher<string>(),
                new PlainMatcher<string>(),
                new PlainMatcher<string>(),
            ];

            const matcher = new InclusiveOrMatcher<string>(...innerMatchers);

            assert.deepEqual(matcher.matchers, innerMatchers);
        });

    });

});
