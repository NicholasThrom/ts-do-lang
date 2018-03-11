import { assert } from "chai";
import "mocha";
import { sandbox as sandboxFactory } from "sinon";
const sandbox = sandboxFactory.create();

import { Matcher } from "parser/generic/matcher/matcher";

import { SingleMatcher } from "parser/generic/matcher/matchers/single";

describe("parser/generic/matcher/matchers/single", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist.", function () {
        assert(SingleMatcher);
    });

    it("should support `instanceOf SingleMatcher`", function () {
        const matcher = new SingleMatcher<string>(() => true);

        assert.isTrue(matcher instanceof SingleMatcher);
    });

    it("should support `instanceOf Matcher`", function () {
        const matcher = new SingleMatcher<string>(() => true);

        assert.isTrue(matcher instanceof Matcher);
    });

    describe(".doesMatch", function () {

        it("should be `false`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            assert.isFalse(matcher.doesMatch);
        });

    });

    describe(".afterStep", function () {

        it("should set `.isAccepted` member to constructor argument", function () {
            const isAcceptedArgument = () => false; // Any function/
            const result = new SingleMatcher<string>(isAcceptedArgument);

            assert.strictEqual(result["isAccepted"], isAcceptedArgument);
        });

        it("should call `isAccepted` once.", function () {
            const isAcceptedSpy = sandbox.spy();
            const matcher = new SingleMatcher<number>(isAcceptedSpy);

            matcher.afterStep(0);

            assert(isAcceptedSpy.calledOnce);
        });

        it("should call `isAccepted` with correct argument.", function () {
            const isAcceptedSpy = sandbox.spy();
            const matcher = new SingleMatcher<string>(isAcceptedSpy);
            const stepArguments = ["any", "array", "of", "anything"];

            stepArguments.forEach((stepArgument) => matcher.afterStep(stepArgument));

            assert(
                isAcceptedSpy.args.every(
                    (isAcceptedArguments, index) =>
                        isAcceptedArguments.length === 1
                        && isAcceptedArguments[0] === stepArguments[index],
                ),
            );
        });

        it("should return null if `isAccepted` returns `false`", function () {
            const matcher = new SingleMatcher<object>((input) => false);

            const result = matcher.afterStep({ any: "object" });

            assert.isNull(result);
        });

        it("should return a `Matcher` if `isAccepted` returns `true`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const result = matcher.afterStep("any string");

            assert.isNotNull(result);
        });

        it("should return a `Matcher` that `.doesMatch` if `isAccepted` returns `true`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const result = matcher.afterStep("any string");

            assert.isTrue(result && result.doesMatch);
        });

        it("should return a `Matcher` that returns `null` on any `.afterStep`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const intermediateMatcher = matcher.afterStep("any string");
            const result = intermediateMatcher && intermediateMatcher.afterStep("any string");

            assert.isNotNull(intermediateMatcher);
            assert.isNull(result);
        });

    });

    describe(".for", function () {

        it("should return a `SingleMatcher` on which `.isAccepted` returns `true` for `input`", function () {
            const input = "any string";
            const result = SingleMatcher.for<string>(input);

            assert(result["isAccepted"](input));
        });

        it("should return a `SingleMatcher` on which `.isAccepted` returns `false` for other `input`s", function () {
            const input = "any string";
            const otherInput = "any other string";
            const result = SingleMatcher.for<string>(input);

            assert.isFalse(result["isAccepted"](otherInput));
        });

    });

});
