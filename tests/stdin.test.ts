import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Lexer } from "../src/core/lexer/lexer";
import { Parser } from "../src/core/parser/parser";
import { Interpreter } from "../src/core/interpreter/interpreter";
import { readFileSource } from "../src/cli-source";

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

test("reads UTF-16 encoded source files", async () => {
	const dir = await mkdtemp(path.join(tmpdir(), "nyxium-"));
	const filePath = path.join(dir, "sample.nyx");
	await writeFile(filePath, Buffer.from([0xff, 0xfe, 0x78, 0x00, 0x2e, 0x00]));

	try {
		const source = await readFileSource(filePath);
		assert.equal(source, "x.");
	} finally {
		await rm(dir, { recursive: true, force: true });
	}
});

test("handles Windows CRLF line endings", () => {
	const source = "x.\r\nx.";
	const lexer = new Lexer(source);
	assert.doesNotThrow(() => lexer.scan());
});

test("ignores comments after # until the end of the line", () => {
	const source = "x. # comment\nx.";
	const lexer = new Lexer(source);
	const tokens = lexer.scan();
	const parser = new Parser(tokens);
	assert.doesNotThrow(() => parser.parse());
});
