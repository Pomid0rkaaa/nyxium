# REPL

Start the interactive interpreter:

```bash
nyx --repl
```

You'll see:

```text
Nyxium REPL
Type :help for commands.
> 
```

## Executing code

Enter Nyxium code and press `Enter`:

```text
> x++++
> x.
4
```

The interpreter keeps its state between commands, so registers, the stack, and remaining input persist until you reset the session.

## Multi-line blocks

If you enter a loop, condition, or arithmetic expression with unmatched delimiters, the REPL waits for the block to be completed.

```text
> x+++++
> x{
... x.
... x-
... }
5 4 3 2 1
```

The prompt changes from > to ... while waiting for the closing delimiter.

## REPL commands

| Command | Description |
| --- | --- |
| `:help` | Show available commands |
| `:status` | Display registers, stack, and remaining input |
| `:input <values>` | Append input values to the input queue |
| `:reset` | Reset registers, stack, and input |
| `:quit` | Exit the REPL |
| `:exit` | Exit the REPL |

## Providing input

Programs can read input exactly as they do from the CLI.

```text
> :input 42;A:
Input appended.

> x&
> x.
42

> y&
> y:
A
```

## Viewing interpreter state

Use `:status` to inspect the current interpreter state.

```text
> :status
Registers: x=42 y=65...
Stack: [3, 2, 1]
Input: [42, 65]
```

## Resetting the session

```text
> :reset
Interpreter reset.
```

This clears all registers, the stack, and any queued input.
