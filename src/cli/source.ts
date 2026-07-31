import { promises as fs } from "node:fs";
import { printHelp } from "./help.js";
import { parseArgs } from "./args.js";

export interface SourceInput {
	source: string;
	stdin: string;
}

export async function resolveSource(
	args: string[],
): Promise<SourceInput | null> {
	const parsed = parseArgs(args);

	if (parsed.help) {
		printHelp();
		return null;
	}

	let source: string | undefined;

	if (parsed.code !== undefined) {
		source = parsed.code;
	} else if (parsed.file !== undefined) {
		source = await readSourceFile(parsed.file);
	}

	if (source === undefined) {
		printHelp();
		return null;
	}

	const stdin = process.stdin.isTTY
		? (parsed.input ?? "")
		: await readStdin();

	return {
		source,
		stdin,
	};
}

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];

	for await (const chunk of process.stdin) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	return Buffer.concat(chunks).toString("utf8").trim();
}

function detectEncoding(buffer: Buffer): BufferEncoding {
	if (buffer.length >= 2) {
		const first = buffer[0];
		const second = buffer[1];
		if (first === 0xff && second === 0xfe) return "utf16le";
		if (first === 0xfe && second === 0xff) return "utf16le";
	}
	return "utf8";
}

export async function readSourceFile(filePath: string): Promise<string> {
	const buffer = await fs.readFile(filePath);
	const text = buffer.toString(detectEncoding(buffer));
	return text.replace(/^\uFEFF/, "");
}
