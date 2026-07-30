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

async function main() {
	const args = process.argv.slice(2);
	const source = args[0] ?? defaultSource;
	const stdin = args[1] ?? (process.stdin.isTTY ? "" : await readStdin());

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
