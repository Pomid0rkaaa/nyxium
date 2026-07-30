import { Lexer } from "./core/lexer/lexer.js";
import { Parser } from "./core/parser/parser.js";
import { Interpreter } from "./core/interpreter/interpreter.js";
import { readFileSource } from "./cli-source.js";

function printHelp(): void {
	console.log(`Usage: nyxium [options] [file]

Options:
  -c, --code <code>  Execute inline code
  -h, --help         Show this help message

Examples:
  nyxium script.nyx
  nyxium -c "x."
  printf '42' | nyxium script.nyx`);
}

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

async function resolveSource(args: string[]): Promise<{ source: string; stdin: string } | null> {
	if (args.includes("-h") || args.includes("--help")) {
		printHelp();
		return null;
	}

	const codeIndex = args.findIndex((arg) => arg === "-c" || arg === "--code");
	if (codeIndex >= 0) {
		const code = args[codeIndex + 1] ?? "";
		const stdinArg = args[codeIndex + 2];
		return {
			source: code,
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

	printHelp();
	return null;
}

async function main() {
	const args = process.argv.slice(2);
	const resolved = await resolveSource(args);
	if (!resolved) {
		return;
	}

	const { source, stdin } = resolved;
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
