import test from "node:test";
import assert from "node:assert/strict";
import { formatNyxiumError, NyxiumError } from "../src/code/errors";
import { Lexer } from "../src/core/lexer/lexer";
import { Parser } from "../src/core/parser/parser";
import { Interpreter } from "../src/core/interpreter/interpreter";

test("formats lexer errors with source context and caret marker", () => {
	const error = new NyxiumError({
		kind: "lexer",
		message: "invalid variable sequence",
		line: 1,
		column: 4,
		source: "x& xx",
		length: 2,
	});

	assert.equal(
		formatNyxiumError(error),
		[
			"error: lexer: 1:4: invalid variable sequence",
			"",
			"1 | x& xx",
			"       ^^",
		].join("\n"),
	);
});

test("rejects loop headers longer than two registers", () => {
	const lexer = new Lexer("xyz{");
	assert.throws(() => lexer.scan(), /invalid variable sequence/);
});

test("loop continues while either register is non-zero", () => {
	const lexer = new Lexer("x& xy{x. x-}");
	const tokens = lexer.scan();
	const parser = new Parser(tokens, "x& xy{x. x-}");
	const program = parser.parse();
	const interpreter = new Interpreter();

	const output = interpreter.interpret(program, "5");
	assert.equal(output, "5 4 3 2 1 ");
});
