import { promises as fs } from "node:fs";
import { Lexer } from "./core/lexer/lexer.js";
import { Parser } from "./core/parser/parser.js";
import { Interpreter } from "./core/interpreter/interpreter.js";

const defaultSource = `
x+++++
x.
`;

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	return Buffer.concat(chunks).toString("utf8").trim();
}

async function readInteractiveInput(prompt = "stdin> "): Promise<string> {
	process.stdout.write(prompt);
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) {
		const text = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		if (text.includes("\n") || text.includes("\r")) {
			chunks.push(text);
			break;
		}
		chunks.push(text);
	}
	return Buffer.concat(chunks).toString("utf8").trim();
}

async function resolveSource(args: string[]): Promise<{ source: string; stdin: string }> {
	const codeIndex = args.findIndex((arg) => arg === "-c" || arg === "--code");
	if (codeIndex >= 0) {
		const code = args[codeIndex + 1] ?? "";
		const stdinArg = args[codeIndex + 2];
		return {
			source: code || defaultSource,
			stdin: stdinArg ?? (process.stdin.isTTY ? await readInteractiveInput() : await readStdin()),
		};
	}

	const filePath = args[0] ?? "";
	if (filePath) {
		const source = await fs.readFile(filePath, "utf8");
		const stdinArg = args[1];
		return {
			source,
			stdin: stdinArg ?? (process.stdin.isTTY ? await readInteractiveInput() : await readStdin()),
		};
	}

	return {
		source: defaultSource,
		stdin: process.stdin.isTTY ? await readInteractiveInput() : await readStdin(),
	};
}

async function main() {
	const args = process.argv.slice(2);
	const { source, stdin } = await resolveSource(args);

	const lexer = new Lexer(source);
	const tokens = lexer.scan();

	const parser = new Parser(tokens);
	const program = parser.parse();

	const interpreter = new Interpreter();
	const output = interpreter.interpret(program, stdin);
	console.log(output);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
