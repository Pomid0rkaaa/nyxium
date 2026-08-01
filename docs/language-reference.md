# Nyxium Language Reference

## Introduction

Nyxium is a small stack- and register-based esoteric programming language implemented in TypeScript.

A Nyxium program is a sequence of instructions operating on six registers and a shared stack. The language focuses on compact syntax while providing arithmetic, control flow, input/output, and memory manipulation.

Nyxium supports:

- register operations
- arithmetic between registers
- stack operations
- loops
- conditional branching
- input and output
- comments

This document describes the syntax and behavior of the Nyxium language.

## Lexical Structure

### Registers

Nyxium has six built-in registers:

```text
x y z a b c
```

Registers store signed integer values.

All registers start with the value:

```text
0
```

Only these six register names are valid.

### Whitespace

The lexer ignores:

- spaces
- tabs
- newlines
- carriage returns

Whitespace can be freely used to format programs.

Example:

```nyx
x& x.
```

is equivalent to:

```nyx
x&x.
```

Instructions can only be combined when their syntax remains unambiguous.

```text
Valid:
x+x.

Valid:
x++++y.

Invalid:
xyz
```

### Comments

A `#` begins a comment.

Everything from `#` until the end of the line is ignored.

Example:

```nyx
x+ # increment x
```

Comments do not affect execution.

## Program Structure

A program is made of a sequence of statements.

Statements can appear:

- one per line
- next to each other
- nested inside loops
- nested inside conditions

Supported statement types:

- register operations
- arithmetic operations
- stack operations
- loops
- conditions

## Register Operations

Register operations use the following form:

```text
<register><operation>
```

Examples:

```nyx
x+
x.
y&
```

### Increment and Decrement

| Syntax | Description |
| --- | --- |
| `x+` | Increase `x` by 1 |
| `x++++` | Increase `x` by 4 |
| `x-` | Decrease `x` by 1 |
| `x------` | Decrease `x` by 6 |

Multiple `+` or `-` symbols are treated as a single operation.

Example:

```nyx
x+++++
x.
```

Output:

```text
5 
```

### Printing

#### Number output

Syntax:

```text
x.
```

Prints the current register value followed by a space.

Example:

```nyx
x+++++
x.
```

Output:

```text
5 
```

#### Character output

Syntax:

```text
x:
```

Prints the register value as a UTF-16 character.

Example:

```nyx
x+++++
x:
```

Outputs:

```text

```

(Character output depends on the numeric value.)

### Stack Transfer

#### Push register

Syntax:

```text
x?
```

Pushes the current value of `x` onto the stack.

Example:

```nyx
x+++++
x?
```

#### Pop into register

Syntax:

```text
x!
```

Removes the top stack value and stores it in `x`.

If the stack is empty, the value `0` is used.

### Input

Syntax:

```text
x&
```

Reads the next input value into `x`.

Input values are separated using `;`.

Example:

Input:

```text
42;10
```

Program:

```nyx
x&
x.
```

Output:

```text
42 
```

If no input value exists, `0` is used.

Invalid numeric input also becomes `0`.

### Character Input

Input values ending in `:` are interpreted as characters.

Example:

```text
A:
```

is converted into the character code of `A`.

Example input:

```text
A:;B:
```

is equivalent to providing:

```text
65;66
```

### Negation

Syntax:

```text
x'
```

Replaces the value of `x` with its negative.

Example:

```nyx
x++++
x'
x.
```

Output:

```text
-4 
```

### Random

Syntax:

```text
x$
```

Replaces `x` with a random integer.

For non-negative values:

```text
0 <= result <= x
```

Example:

```nyx
x+++
x$
```

produces:

```text
0, 1, 2, or 3
```

If the current value is negative, the result is `0`.

## Arithmetic

Arithmetic operations combine two registers.

Syntax:

```text
<left><right>[<operator><action>]
```

Example:

```nyx
x++++
y++
xy[+.]
```

This prints:

```text
6 
```

### Operators

Supported arithmetic operators:

| Operator | Meaning |
| --- | --- |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |

### Actions

The final symbol determines what happens with the result.

| Action | Meaning |
| --- | --- |
| `.` | Print result as number |
| `:` | Print result as character |
| `!` | Store result in left register |
| `?` | Push result onto stack |

### Arithmetic Examples

#### Addition

```nyx
x& y&
xy[+.]
```

Reads two numbers and prints their sum.

#### Store result

```nyx
x++++
y++
xy[+!]
```

Stores:

```text
x = x + y
```

#### Push result

```nyx
xy[+?]
```

Calculates `x + y` and pushes the result onto the stack.

### Division

Division uses integer floor division.

Example:

```text
5 / 2 = 2
```

Division by zero produces:

```text
0
```

## Stack Operations

Nyxium has a shared stack used for temporary storage and communication between registers.

Stack operations do not require a register.

### Pop and print

Syntax:

```nyx
!
```

Removes the top stack value and prints it as a number.

If the stack is empty, `0` is printed.

Example:

```nyx
x+++++
x?
!
```

Output:

```text
5 
```

### Pop and print character

Syntax:

```nyx
!:
```

Removes the top stack value and prints it as a character.

Example:

```nyx
x+++++
x?
!:
```

### Swap

Syntax:

```nyx
~
```

Swaps the top two stack values.

Example:

```nyx
x+++++
x?
x++
x?
~
```

The top two stack values are exchanged.

If fewer than two values exist, the operation does nothing.

### Drop

Syntax:

```nyx
_
```

Removes the top stack value.

If the stack is empty, nothing happens.

Example:

```nyx
x?
_
```

## Loops

Loops execute a block repeatedly while one or more registers are non-zero.

Syntax:

```text
<register>[<register>]{
    statements
}
```

A loop can contain one or two registers.

Valid:

```nyx
x{
}
```

```nyx
xy{
}
```

Invalid:

```nyx
xyz{
}
```

### Single-register loop

Example:

```nyx
x+++++

x{
    x.
    x-
}
```

Execution:

1. Print `x`
2. Decrease `x`
3. Repeat until `x` becomes `0`

Output:

```text
5 4 3 2 1 
```

### Multiple-register loop

Example:

```nyx
xy{
    x-
}
```

The loop continues while:

```text
x != 0 OR y != 0
```

At least one register in the loop header must be non-zero.

### Nested loops

Loops can be nested.

Example:

```nyx
x{
    y{
        y-
    }
    x-
}
```

### Loop limit

To prevent infinite execution, loops have a maximum of:

```text
10000 iterations
```

Exceeding this limit causes an interpreter error.

## Conditions

Conditions execute different code depending on a comparison.

Syntax:

```text
<left><operator><right>(
    then
|
    else
)
```

### Default condition

A condition may omit the comparison.

Example:

```nyx
x(
    x.
)
```

The body executes when the register value is not zero.

### Comparison operators

| Operator | Meaning |
| --- | --- |
| `=` | Equal |
| `>` | Greater than |
| `<` | Less than |
| `^` | Not equal |

### Comparing registers

Example:

```nyx
x=y(
    x.
)
```

The branch executes when:

```text
x == y
```

### Else branch

The `|` symbol separates the then branch and else branch.

Example:

```nyx
x=y(
    x.
|
    y.
)
```

If `x == y`, the first branch runs.

Otherwise, the second branch runs.

If no `|` exists, the else branch is empty.

### Nested conditions

Conditions can contain other conditions.

Example:

```nyx
x(
    y(
        z.
    )
)
```

## Input and Output Summary

### Input

Input is read using:

```nyx
x&
```

Input format:

```text
value;value;value
```

Supported values:

- numbers
- single-character values ending with `:`

Examples:

```text
42
```

```text
A:
```

Missing input:

```text
0
```

Invalid numeric input:

```text
0
```

### Output

Number output:

```nyx
x.
```

Prints:

```text
value + space
```

Character output:

```nyx
x:
```

Prints the value as a UTF-16 character.

## Runtime Behavior

### Empty stack

The following operations use `0` when no value exists:

- register pop (`x!`)
- stack print (`!`)
- stack character print (`!:`)

Operations that remove or rearrange missing values do nothing:

- swap (`~`)
- drop (`_`)

### Division by zero

Division by zero always produces:

```text
0
```

Example:

```nyx
x++++
y
xy[/!]
```

stores `0`.

### Random values

Random generation:

```nyx
x$
```

produces a random integer from:

```text
0..x
```

for positive values.

Negative values produce:

```text
0
```

## Common Idioms

### Copy a register

Nyxium does not have a dedicated copy instruction.

Use the stack:

```nyx
x?
y!
```

This copies `x` into `y`.

### Countdown loop

```nyx
x+++++

x{
    x-
}
```

Runs five times.

### Generate characters

A common pattern:

```nyx
x:
x+
```

prints a character and moves to the next character code.

### Store arithmetic result

Example:

```nyx
xy[+!]
```

means:

```text
x = x + y
```

## Example Programs

The [`examples/`](../examples/) directory contains complete, commented Nyxium programs ranging
from simple demonstrations to larger examples. The following programs are good
starting points:

### [echo.nyx](../examples/echo.nyx)

Reads a character and immediately prints it back.

Demonstrates:

- character input
- character output

### [adder.nyx](../examples/adder.nyx)

Reads two numbers and prints their sum.

Demonstrates:

- numeric input
- arithmetic
- numeric output

### [copy_register.nyx](../examples/copy_register.nyx)

Copies one register to another using the stack.

Demonstrates:

- stack operations
- register transfer idioms

### [alphabet.nyx](../examples/alphabet.nyx)

Constructs the ASCII value of `A` and prints the uppercase alphabet.

Demonstrates:

- arithmetic
- loops
- character output

### [factorial.nyx](../examples/factorial.nyx)

Calculates the factorial of an input value.

Demonstrates:

- loops
- multiplication
- accumulator variables

### [max.nyx](../examples/max.nyx)

Prints the larger of two input values.

Demonstrates:

- comparisons
- conditional branching

### [guess_number.nyx](../examples/guess_number.nyx)

A small guessing game using random numbers.

Demonstrates:

- random number generation
- stack manipulation
- conditional branching
- character output

## Complete Syntax Summary

| Syntax | Meaning |
| --- | --- |
| `x+` | Increment register |
| `x-` | Decrement register |
| `x.` | Print number |
| `x:` | Print character |
| `x?` | Push register |
| `x!` | Pop into register |
| `x&` | Read input |
| `x'` | Negate register |
| `x$` | Random value |
| `xy[+.]` | Arithmetic output |
| `xy[+!]` | Store arithmetic result |
| `xy[+?]` | Push arithmetic result |
| `xy{}` | Loop |
| `x=y()` | Conditional |
| `!` | Pop and print |
| `!:` | Pop and print character |
| `~` | Swap stack |
| `_` | Drop stack value |
| `#` | Comment |
