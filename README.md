<p align="center">
  <img src="docs/assets/nyxium-logo.png" width="128" alt="Nyxium logo">
</p>

<h1 align="center">Nyxium</h1>

<p align="center">
  A small interpreted register-based esoteric programming language implemented in TypeScript.
</p>

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
nyxium --help
```

> **Note:** Nyxium is not published to npm. If you don't want to use `npm link`, you can run the interpreter directly with `node dist/index.js`.

## Usage

```text
Usage:
  nyxium [options] [file]

Options:
  -c, --code  <code>    Execute inline code
  -i, --input <string>  Program input (;-separated, e.g. 3;A:;42)
  -h, --help            Show this help message
```

Run a source file:

```bash
nyxium examples/alphabet.nyx
```

Execute inline code:

```bash
nyxium -c "x."
```

Provide input via the command line:

```bash
nyxium -i "3;5" -c "x& x. y& y."
```

Or pipe input through standard input (overrides `-i`):

```bash
echo "42" | nyxium examples/adder.nyx
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

The `examples/` directory contains several sample programs:

- `adder.nyx`
- `alphabet.nyx`
- `compare.nyx`
- `factorial.nyx`
- `guess_number.nyx`
- `if_number.nyx`

For example:

```bash
nyxium examples/factorial.nyx
```

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
npm run build:single
npm run build:min
npm run build:web
```
