# Nyxium CLI

The Nyxium command-line interface allows you to execute source files, run inline code, provide program input, or start an interactive REPL.

## Usage

```text
nyx [options] [file]
```

If neither a source file nor inline code is provided, the CLI displays the help message.

## Options

| Option | Description |
| --- | --- |
| `-c`, `--code <code>` | Execute inline Nyxium code. |
| `-i`, `--input <string>` | Provide program input. Values are separated by `;`. |
| `-r`, `--repl` | Start the interactive REPL. |
| `-h`, `--help` | Display the help message. |

## Running a Source File

Execute a Nyxium program stored in a file:

```bash
nyx examples/factorial.nyx
```

## Executing Inline Code

Run a short program directly from the command line:

```bash
nyx -c "x++++ x."
```

This is useful for testing small snippets without creating a file.

## Program Input

Programs read input using the `&` instruction.

Input values are supplied as a semicolon-separated list.

Example:

```bash
nyx -i "3;5" examples/adder.nyx
```

or

```bash
nyx -i "A:" examples/echo.nyx
```

Character values are written as a single character followed by `:`.

For details about the input format, see the [Language Reference](language-reference.md).

## Reading from Standard Input

If data is piped into the interpreter, standard input is used instead of the `--input` option.

Example:

```bash
echo "42" | nyx examples/echo.nyx
```

If both piped input and `--input` are provided, the piped input takes precedence.

## Interactive REPL

Start the interactive interpreter:

```bash
nyx --repl
```

or

```bash
nyx -r
```

The REPL preserves interpreter state between commands and supports multi-line programs.

See [REPL Guide](repl.md) for available commands and usage.

## File Encoding

Source files are read as UTF-8 by default.

UTF-16 Little Endian files are detected automatically, and an optional UTF Byte Order Mark (BOM) is ignored.

## Exit Status

The interpreter exits with:

| Code | Meaning |
| --- | --- |
| `0` | Program executed successfully. |
| `1` | An interpreter or runtime error occurred. |

## Examples

Run a program:

```bash
nyx examples/alphabet.nyx
```

Execute inline code:

```bash
nyx -c "x++++ x."
```

Provide command-line input:

```bash
nyx -i "10;20" examples/adder.nyx
```

Use piped input:

```bash
echo "100" | nyx examples/echo.nyx
```

Start the REPL:

```bash
nyx -r
```

Display help:

```bash
nyx --help
```
