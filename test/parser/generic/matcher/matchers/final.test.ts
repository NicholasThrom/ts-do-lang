import { assert } from "chai";
import "mocha";
import * as sinon from "sinon";
const sandbox = sinon.sandbox.create();

// Subject
import { FinalMatcher } from "parser/generic/matcher/matchers/final";

describe("parser/generic/matcher/matchers/final", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist.", function () {
        assert(FinalMatcher);
    });

    describe(".doesMatch", function () {

        it("should be true", function () {
            const matcher = new FinalMatcher<number>();

            assert.strictEqual(matcher.doesMatch, true);
        });

    });

    describe(".step", function () {

        it("should return null for all inputs.", function () {
            const matcher = new FinalMatcher<any>();

            assert.strictEqual(matcher.step("any input"), null);
        });

    });

});
