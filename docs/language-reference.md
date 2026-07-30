# Nyxium Language Reference

Nyxium is a tiny stack- and register-based esoteric language implemented in TypeScript.

## Overview

Programs are a sequence of instructions. Each instruction acts on one of the named registers `x`, `y`, `z`, `a`, `b`, or `c`.

The interpreter supports:

- register arithmetic and mutation
- stack operations
- loops
- conditional branching
- input and output

## Registers

The language uses six named registers:

- `x`
- `y`
- `z`
- `a`
- `b`
- `c`

Registers start at `0`.

## Instructions

### Register operations

| Syntax | Meaning |
| --- | --- |
| `x+` | Increment register `x` by 1 |
| `x++++` | Increment register `x` by 4 |
| `x-` | Decrement register `x` by 1 |
| `x------` | Decrement register `x` by 6 |
| `x.` | Print the current value of `x` as a number |
| `x:` | Print the current value of `x` as a character |
| `x?` | Push the value of `x` onto the stack |
| `x!` | Pop a value from the stack into `x` |
| `x&` | Read the next input value into `x` |
| `x^` | Negate `x` |
| `x$` | Replace `x` with a random number between `0` and its current value |

### Arithmetic between registers

Arithmetic instructions use two registers and an operator:

| Syntax | Meaning |
| --- | --- |
| `xy[+.]` | Print `x + y` |
| `xy[-.]` | Print `x - y` |
| `xy[*.]` | Print `x * y` |
| `xy[/.]` | Print `x / y` (integer division) |

The pattern is:

```text
<left><right>[<operator><action>]
```

Supported actions:

- `.` print as a number
- `:` print as a character
- `!` store the result back into the left register
- `?` push the result onto the stack

### Stack operations

| Syntax | Meaning |
| --- | --- |
| `!` | Pop a value from the stack and print it |
| `!:` | Pop a value from the stack and print it as a character |
| `~` | Swap the top two stack values |
| `_` | Drop the top stack value |

### Loops

A loop is written as a register name followed by `{` and a body, ending in `}`.

```text
x{
  x-
}
```

The loop continues while at least one register in the loop header is non-zero.

### Conditions

Conditions use a register and optionally a comparison register.

```text
x(x.)
```

Or with an explicit comparison:

```text
x=y(x.)
```

Supported operators:

- `=` equal
- `>` greater than
- `<` less than
- `^` not equal

The condition syntax is:

```text
<left><operator><right>(<then-branch>|<else-branch>)
```

### Comments

A `#` starts a comment and everything until the end of the line is ignored.

```text
x. # this line prints x
```

## Input and output

- `.` prints a number followed by a space.
- `:` prints a character.
- `&` reads the next input value.
- Input is parsed from stdin as values separated by `;`.
- If no input is provided, the interpreter uses `0` for missing values.

## Example

```text
x&x.
```

This reads one input value into `x` and prints it.
