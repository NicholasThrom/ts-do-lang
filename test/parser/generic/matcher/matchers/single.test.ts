import { assert } from "chai";
import "mocha";
import { sandbox as sandboxFactory } from "sinon";
const sandbox = sandboxFactory.create();

import { SingleMatcher } from "parser/generic/matcher/matchers/single";

describe("parser/generic/matcher/matchers/single", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist.", function () {
        assert(SingleMatcher);
    });

    describe(".step", function () {

        it("should set `.isAccepted` member to constructor argument", function () {
            const isAcceptedArgument = () => false; // Any function/
            const result = new SingleMatcher<string>(isAcceptedArgument);

            assert.strictEqual(result["isAccepted"], isAcceptedArgument);
        });

        it("should call `isAccepted` once.", function () {
            const isAcceptedSpy = sandbox.spy();
            const matcher = new SingleMatcher<number>(isAcceptedSpy);

            matcher.step(0);

            assert(isAcceptedSpy.calledOnce);
        });

        it("should call `isAccepted` with correct argument.", function () {
            const isAcceptedSpy = sandbox.spy();
            const matcher = new SingleMatcher<string>(isAcceptedSpy);
            const stepArguments = ["any", "array", "of", "anything"];

            stepArguments.forEach((stepArgument) => matcher.step(stepArgument));

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

            const result = matcher.step({ any: "object" });

            assert.isNull(result);
        });

        it("should return a `Matcher` if `isAccepted` returns `true`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const result = matcher.step("any string");

            assert.isNotNull(result);
        });

        it("should return a `Matcher` that `.doesMatch` if `isAccepted` returns `true`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const result = matcher.step("any string");

            assert.isTrue(result && result.doesMatch);
        });

        it("should return a `Matcher` that returns `null` on any `.step`", function () {
            const matcher = new SingleMatcher<string>((input) => true);

            const intermediateMatcher = matcher.step("any string");
            const result = intermediateMatcher && intermediateMatcher.step("any string");

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
