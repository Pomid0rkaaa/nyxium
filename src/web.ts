import { Interpreter } from "./core/interpreter/interpreter.js";

(globalThis as any).interpret = (source: string, input = "") =>
	new Interpreter().input(input).exec(source);
