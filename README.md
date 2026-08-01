<p align="center">
  <img src="docs/assets/nyxium-logo.png" width="128" alt="Nyxium logo">
</p>

<h1 align="center">Nyxium</h1>

<p align="center">
  A small interpreted register-and-stack esoteric programming language implemented in TypeScript.
</p>

<p align="center">
  <a href="docs/language-reference.md">Language Reference</a>
  •
  <a href="examples/">Examples</a>
</p>

## Overview

Nyxium is a small symbolic programming language built around a simple execution model:

- six built-in registers (`x y z a b c`)
- a shared stack
- integer arithmetic
- structured loops and conditions
- character and numeric input/output

The goal of Nyxium is to stay minimal and compact while still being capable of writing complete programs.

## Example

```nyx
x+++++

x{
    x.
    x-
}
```

Output:

```text
5 4 3 2 1
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Pomid0rkaaa/nyxium.git
cd nyxium
npm install
```

Build the project:

```bash
npm run build
```

Link the CLI globally:

```bash
npm link
```

You can now run Nyxium from anywhere:

```bash
nyx --help
```

> **Note:** Nyxium is not published to npm. If you don't want to use `npm link`, you can run the interpreter directly with `node dist/nyxium.min.mjs`.

## Usage

```text
Usage:
  nyx [options] [file]

Options:
  -c, --code  <code>    Execute inline code
  -i, --input <string>  Program input (;-separated, e.g. 3;A:;42)
  -h, --help            Show this help message
```

Run a source file:

```bash
nyx examples/alphabet.nyx
```

Execute inline code:

```bash
nyx -c "x."
```

Provide input via the command line:

```bash
nyx -i "3;5" -c "x& x. y& y."
```

Or pipe input through standard input (overrides `-i`):

```bash
echo "42" | nyx examples/adder.nyx
```

## Language Overview

Nyxium is a tiny register-based esoteric language featuring:

- register operations
- arithmetic
- stack manipulation
- loops
- conditional branching
- comments

For the complete syntax and semantics, see the [language reference](docs/language-reference.md).

## Examples

The [`examples/`](examples/) directory contains complete, commented Nyxium programs.

Run any example with:

```bash
nyx examples/factorial.nyx
```

See the [Language Reference](docs/language-reference.md) for an overview of the language and selected examples.

## Development

Install dependencies:

```bash
npm install
```

Useful commands:

```bash
npm run dev         # Watch mode
npm run build       # Build the project
npm run test        # Run tests
npm run typecheck   # Type-check the project
npm run clean       # Remove the dist/ directory
```

Additional build targets:

```bash
npm run build:single   # Create a standalone single-file interpreter
npm run build:dev      # Compile TypeScript output
npm run build:web      # Create browser playground in dist/web
```

## License

Nyxium is released under the MIT License.
