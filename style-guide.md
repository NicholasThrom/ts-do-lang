# Style Guide

This style guide exists to save time making trivial decisions.

This style guide does not claim to be objectively correct,
nor better than others.

## Contents

- [Things not included in this file](#things-not-included-in-this-file)
- [Markdown](#markdown)
- [File Structure](#file-structure)
- [Documentation Comments](#documentation-comments)
    - [_"should"_](#should)
    - [Formatting](#formatting)
- [Comments](#comments)
- [Code Formatting](#code-formatting)
- [Naming](#naming)
- [Exports & Modules](#exports-modules)
- [Tests](#tests)

## Things not included in this file

If something significant is not included in this file,
see what the rest of the code does, make a decision, and add it to this file.

## Markdown

Lines should not exceed 80 characters.
This improves diffs.

Break lines in natural places, not just after 80 characters.
This saves time if the length of one line changes.

## File Structure

Many directories are preferred to many files in a directory.
A directory with one file in it is acceptable.

If the purpose of a directory isn't immediately apparent,
place a `README.md` inside explaining it.

Many files are preferred to large files.

## Documentation Comments

Documentation comments are strongly preferred to no documentation comments.

More information is preferred to less information.

Concise documentation comments are preferred to verbose documentation comments.

Documentation comments that just restate the signature and type are useless.

### _"should"_

Do not use the word _"should"_ in documentation comments;
use documentation comments to tell what is, not what _"should"_ be.

For example, if a documentation comment says an argument _should_ be an integer,
it is ambiguous.
Will floats cause errors?
Will floats silently return incorrect results?
Will floats not be supported in the future?
Are floats against the philosophical purpose of the function?
Did the documenter just proclivity for integers?

Instead of using _"should"_,
state what happens if the argument is not an integer
and let the reader decide what they should do based on this behaviour.
Even better, use the word _"must"_ and throw an error if it is not.

### Formatting

Documentation comments should use markdown.

References to other classes should be wrapped in \`\`s.
Pluralizations of other classes should not be part of \`\`
unless the pluralization does not contain the original word.

For example, `` `Duck`s `` and `` `Geese` ``
are the plural of `` `Duck` `` and `` `Goose` ``.

References to parts of code should be used whenever possible.
For example, `` If the `Animal`s `.canFly` ``
is preferred to `If the animals can fly`.

## Comments

Comments may use markdown, even though they are not parsed.
Markdown is designed to be readable as plain text,
and documentation comments are written in markdown,
so anyone reading comments will be familiar with plaintext markdown.

## Code Formatting

Listen to `ts-lint`.

If something absolutely must go against `ts-lint`,
[disable the specific rule](ts-lint) with a comment.

[ts-lint]: https://palantir.github.io/tslint/usage/rule-flags/

`ts-lint` does not enforce the amount of indentation,
other than ensuring it is divisible by 4.
Obviously this should not be abused.

Where `ts-lint` does not have an opinion,
choose the most readable option.

## Naming

Consider reading [Swift's naming guidelines](swift-names).
Although they are not enforced in this style guide,
they are still useful to follow.

[swift-names]: https://swift.org/documentation/api-design-guidelines/#naming

Long descriptive names are preferred to short ambiguous names.

Short descriptive names are preferred to long descriptive names.

Words should not be shortened unless their long form would be suprising.

For example, `init`, `url`, and `cos`
are preferred to `initialize`, `universalResourceLocator`, and `cosine`.

If acronyms must be used, they should be all upper or lower case.

For example, `nextURL` and `urlOfResource` are preferred to `nextUrl` and `URLOfResource`.

Variable names that are accessible outside the file
in which they are declared must be descriptive without context.
Variable names that are not accessible outside the file
in which they are declared may rely on context to be descriptive.

For example, a private variable in the function `sum` may be named `result`,
but a public variable would be better named `sumOfInputs`.

## Exports & Modules

Default exports must not be used.

Primitives and functions must not be exported directly.

Each file may only have one export statement.
This export statement must be the last statement.
This export statement may include multiple things.

Any code run on the import of a file
that has side effects or relies on state outside the file
must be in a function on an exported object
so it can be unit tested.

## Tests

Test files must end in `.test.ts`.

Tests in a file must be in a `describe("file/name")`.

Every import must be tested for existence.

Each member must have its own `describe(".memberName")`.

Other `describe`s may be used.

Variables must be declared inside the describe.
The exception to this is `sandbox`,
as it is part of the `sinon` import,
and may be needed before importing the subject.

To save time, this template may be used:

```ts
import * as chai from "chai";
import "mocha";
import * as sinon from "sinon";
const sandbox = sinon.sandbox.create();

import { Subject } from "file/name";

describe("file/name", function () {

    afterEach(function () {
        sandbox.restore();
    });

    it("should exist", function () {
        chai.assert(Subject);
    });

});
```

## Commits

Commit messages serve two purposes.
They explain lines of code in blame,
and document the changes to the code.

The first line of a commit message must explain every line of code changed.
The first line must be as short as possible.

The second line must be blank.

The remaining lines may expand upon the first line.

If changes do not fit together, they must be put them in seperate commits.

Many detailed commits are preferred to few, large commits.
