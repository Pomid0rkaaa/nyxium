import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { formatNyxiumError } from "../code/errors.js";
import { Interpreter } from "../core/interpreter/interpreter.js";

export async function repl(): Promise<void> {
	const rl = readline.createInterface({
		input: stdin,
		output: stdout,
		terminal: true,
	});

	const interpreter = new Interpreter();

	console.log("Nyxium REPL");
	console.log("Type :help for commands.");

	let buffer = "";
	let depth = 0;

	try {
		while (true) {
			const prompt = depth === 0 ? "> " : "... ";
			const line = (await rl.question(prompt)).trim();

			if (depth === 0 && line.startsWith(":")) {
				if (!(await command(line, interpreter))) break;
				continue;
			}

			buffer += line + "\n";
			depth += balance(line);

			if (depth > 0) continue;

			try {
				const output = interpreter.exec(buffer);

				if (output !== "") process.stdout.write(output + "\n");
			} catch (error) {
				console.error(formatNyxiumError(error));
			}

			buffer = "";
			depth = 0;
		}
	} finally {
		rl.close();
	}
}

function balance(source: string): number {
	let delta = 0;

	for (const c of source) {
		if (c === "{" || c === "(" || c === "[") delta++;
		else if (c === "}" || c === ")" || c === "]") delta--;
	}

	return delta;
}

async function command(
	line: string,
	interpreter: Interpreter,
): Promise<boolean> {
	const [cmd, ...rest] = line.slice(1).split(/\s+/);
	const arg = rest.join(" ");

	switch (cmd) {
		case "h":
		case "help":
			console.log(`
Commands:
  :h, :help                  Show this help
  :s, :status                Show registers, stack, and remaining input
      :regs                  Show registers
      :stack                 Show the stack
  :i, :input [<values>]      Show remaining input, or append input values
                               (e.g. 42;65;B:;C:)
  :r, :reset                 Reset the interpreter state
      :clear                 Clear the terminal
  :q, :quit, :exit           Exit the REPL
`);
			break;

		case "s":
		case "status": {
			console.log(interpreter.dump().join("\n\n"));
			break;
		}
		case "regs": {
			const [regs] = interpreter.dump();
			console.log(regs);
			break;
		}
		case "stack": {
			const [, stack] = interpreter.dump();
			console.log(stack);
			break;
		}

		case "i":
		case "input":
			if (arg !== "") {
				interpreter.input(arg);
				console.log("Input appended.");
			} else {
				const [, , input] = interpreter.dump();
				console.log(input);
			}
			break;

		case "r":
		case "reset":
			interpreter.reset();
			console.log("Interpreter reset.");
			break;

		case "clear":
			console.clear();
			break;

		case "q":
		case "quit":
		case "exit":
			return false;

		case "":
			break;

		default:
			console.log(`Unknown command: :${cmd}`);
			console.log("Type :help for available commands.");
	}

	return true;
}
