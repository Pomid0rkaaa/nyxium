import test from "node:test";
import assert from "node:assert/strict";
import { Lexer } from "../src/core/lexer/lexer";
import { Parser } from "../src/core/parser/parser";
import { Interpreter } from "../src/core/interpreter/interpreter";

test("reads stdin values for input operations", () => {
	const source = "x&x.";
	const lexer = new Lexer(source);
	const tokens = lexer.scan();
	const parser = new Parser(tokens);
	const program = parser.parse();
	const interpreter = new Interpreter();

	const output = interpreter.interpret(program, "42");
	assert.equal(output, "42 ");
});
