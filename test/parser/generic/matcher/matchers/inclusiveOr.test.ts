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

    describe(".doesMatch", function () {
        class TrueMatcher<Type> extends Matcher<Type> {
            public readonly doesMatch = true;
            public step() { return this; }
        }

        class FalseMatcher<Type> extends Matcher<Type> {
            public readonly doesMatch = false;
            public step() { return this; }
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

});
