<p align="center">
  <img src="docs/assets/nyxium-logo.png" width="128" alt="Nyxium logo">
</p>

<h1 align="center">Nyxium</h1>

<p align="center">
  A small interpreted register-and-stack based esoteric programming language implemented in TypeScript.
</p>

<p align="center">
  <a href="docs/language-reference.md">Language Reference</a>
  •
  <a href="docs/cli.md">CLI Guide</a>
  •
  <a href="docs/repl.md">REPL Guide</a>
  •
  <a href="examples/">Examples</a>
</p>

## Overview

Nyxium is a compact symbolic programming language built around a simple execution model:

- six built-in registers (`x y z a b c`)
- a shared stack
- integer arithmetic
- structured loops and conditions
- character and numeric input/output

The goal of Nyxium is to stay minimal while still being expressive enough to write complete programs.

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

Verify the installation:

```bash
nyx --help
```

> **Note:** Nyxium is not published to npm. You can also run the interpreter directly with `node dist/nyxium.min.mjs`.

## Quick Start

Run a source file:

```bash
nyx examples/alphabet.nyx
```

Execute inline code:

```bash
nyx -c "x++++ x."
```

Start the interactive REPL:

```bash
nyx --repl
```

For all command-line options, see the [CLI Guide](docs/cli.md).

## Documentation

- **[Language Reference](docs/language-reference.md)** - complete language syntax and semantics.
- **[CLI Guide](docs/cli.md)** - command-line usage, options, and input handling.
- **[REPL Guide](docs/repl.md)** - interactive interpreter and REPL commands.
- **[Examples](examples/)** - complete example programs.

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
npm run build:single   # Standalone single-file interpreter
npm run build:dev      # Compile TypeScript output
npm run build:web      # Browser playground
```

## License

Nyxium is released under the MIT License.
