import { printHelp } from "./help.js";
import { readSourceFile } from "./source.js";

export interface SourceInput {
	source: string;
	stdin: string;
}

export async function resolveSource(
	args: string[],
): Promise<SourceInput | null> {
	if (args.includes("-h") || args.includes("--help")) {
		printHelp();
		return null;
	}
	const codeIndex = args.findIndex((arg) => arg === "-c" || arg === "--code");
	if (codeIndex >= 0) {
		const code = args[codeIndex + 1] ?? "";
		const stdin = args[codeIndex + 2] ?? (await resolveStdin());
		return {
			source: code,
			stdin,
		};
	}
	const filePath = args[0] ?? "";
	if (filePath) {
		const source = await readSourceFile(filePath);
		const stdin = args[1] ?? (await resolveStdin());
		return {
			source,
			stdin,
		};
	}
	printHelp();
	return null;
}

async function resolveStdin(): Promise<string> {
	if (process.stdin.isTTY) return "";
	return await readStdin();
}

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin)
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	return Buffer.concat(chunks).toString("utf8").trim();
}
