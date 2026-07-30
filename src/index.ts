import { Lexer } from "./core/lexer/lexer.js";
import { Parser } from "./core/parser/parser.js";
import { Interpreter } from "./core/interpreter/interpreter.js";
import { readFileSource } from "./cli-source.js";

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

async function resolveStdin(): Promise<string> {
	if (process.stdin.isTTY) {
		return "";
	}
	return await readStdin();
}

async function resolveSource(args: string[]): Promise<{ source: string; stdin: string }> {
	const codeIndex = args.findIndex((arg) => arg === "-c" || arg === "--code");
	if (codeIndex >= 0) {
		const code = args[codeIndex + 1] ?? "";
		const stdinArg = args[codeIndex + 2];
		return {
			source: code || defaultSource,
			stdin: stdinArg ?? (await resolveStdin()),
		};
	}

	const filePath = args[0] ?? "";
	if (filePath) {
		const source = await readFileSource(filePath);
		const stdinArg = args[1];
		return {
			source,
			stdin: stdinArg ?? (await resolveStdin()),
		};
	}

	return {
		source: defaultSource,
		stdin: await resolveStdin(),
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
