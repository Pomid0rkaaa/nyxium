import { Lexer } from "../core/lexer/lexer.js";
import { Parser } from "../core/parser/parser.js";
import { Interpreter } from "../core/interpreter/interpreter.js";
import { resolveSource } from "./args.js";

export async function run(argv: string[]): Promise<void> {
	try {
		const args = argv.slice(2);
		const resolved = await resolveSource(args);
		if (!resolved) return;
		const { source, stdin } = resolved;
		const lexer = new Lexer(source);
		const tokens = lexer.scan();
		const parser = new Parser(tokens);
		const program = parser.parse();
		const interpreter = new Interpreter();
		const output = interpreter.interpret(program, stdin);
		if (output !== "") console.log(output);
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
	}
}
