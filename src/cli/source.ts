import { promises as fs } from "node:fs";

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
