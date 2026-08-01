import { formatNyxiumError } from "../code/errors.js";
import { Interpreter } from "../core/interpreter/interpreter.js";
import { resolveSource } from "./source.js";

export async function run(argv: string[]): Promise<void> {
	try {
		const args = argv.slice(2);
		const resolved = await resolveSource(args);
		if (!resolved) return;
		const { source, input } = resolved;
		const output = new Interpreter().input(input).exec(source);
		if (output !== "") console.log(output);
	} catch (error) {
		console.error(formatNyxiumError(error));
		process.exitCode = 1;
	}
}
