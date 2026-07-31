export type NyxiumErrorKind =
	| "lexer"
	| "parser"
	| "interpreter"
	| "runtime"
	| "error";

export interface NyxiumErrorOptions {
	kind: NyxiumErrorKind;
	message: string;
	line?: number;
	column?: number;
	source?: string;
	length?: number;
}

export class NyxiumError extends Error {
	readonly kind: NyxiumErrorKind;
	readonly line?: number;
	readonly column?: number;
	readonly source?: string;
	readonly length?: number;

	constructor(options: NyxiumErrorOptions) {
		super(options.message);
		this.name = "NyxiumError";
		this.kind = options.kind;
		this.line = options.line;
		this.column = options.column;
		this.source = options.source;
		this.length = options.length;
	}
}

export function formatNyxiumError(error: unknown): string {
	if (error instanceof NyxiumError) {
		return formatNyxiumErrorDetails(error);
	}

	if (error instanceof Error) {
		return `error: ${error.message}`;
	}

	return `error: ${String(error)}`;
}

function formatNyxiumErrorDetails(error: NyxiumError): string {
	const header = error.line && error.column
		? `error: ${error.kind}: ${error.line}:${error.column}: ${error.message}`
		: `error: ${error.kind}: ${error.message}`;

	if (!error.source || !error.line || !error.column) {
		return header;
	}

	const lineNumber = error.line;
	const lines = error.source.split(/\r?\n/);
	const lineText = lines[lineNumber - 1] ?? "";
	const width = Math.max(1, error.length ?? 1);
	const caret = "^".repeat(width);
	const padding = " ".repeat(
		`${lineNumber} | `.length + Math.max(0, error.column - 1),
	);

	return [
		header,
		"",
		`${lineNumber} | ${lineText}`,
		`${padding}${caret}`,
	].join("\n");
}
