import { assert } from "chai";
import "mocha";
import { sandbox as sandboxFactory } from "sinon";
const sandbox = sandboxFactory.create();

import { Matcher } from "parser/generic/matcher/matcher";

import { FinalMatcher } from "parser/generic/matcher/matchers/final";

describe("parser/generic/matcher/matchers/final", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist", function () {
        assert(FinalMatcher);
    });

    it("should support `instanceof InclusiveOrMatcher`", function () {
        const matcher = new FinalMatcher<number>();

        assert.isTrue(matcher instanceof FinalMatcher);
    });

    it("should support `instanceOf Matcher`", function () {
        const matcher = new FinalMatcher<number>();

        assert.isTrue(matcher instanceof Matcher);
    });

    describe(".doesMatch", function () {

        it("should be `true`", function () {
            const matcher = new FinalMatcher<number>();

            assert.strictEqual(matcher.doesMatch, true);
        });

    });

    describe(".afterStep", function () {

        it("should return `null` for any input", function () {
            const matcher = new FinalMatcher<any>();

            assert.strictEqual(matcher.afterStep("any input"), null);
        });

    });

});
