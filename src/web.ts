import { Lexer } from "./core/lexer/lexer.js";
import { Parser } from "./core/parser/parser.js";
import { Interpreter } from "./core/interpreter/interpreter.js";

export function interpret(source: string, stdin = ""): string {
	const lexer = new Lexer(source);
	const tokens = lexer.scan();

	const parser = new Parser(tokens);
	const program = parser.parse();

	const interpreter = new Interpreter();
	return interpreter.interpret(program, stdin);
}

(globalThis as any).interpret = interpret;