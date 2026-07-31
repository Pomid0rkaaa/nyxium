export interface ParsedArgs {
	help: boolean;
	file?: string;
	code?: string;
	input?: string;
}

export function parseArgs(args: string[]): ParsedArgs {
	const parsed: ParsedArgs = {
		help: false,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		switch (arg) {
			case "-h":
			case "--help":
				parsed.help = true;
				break;
			case "-c":
			case "--code":
				parsed.code = args[++i] ?? "";
				break;
			case "-i":
			case "--input":
				parsed.input = args[++i] ?? "";
				break;
			default:
				if (!arg.startsWith("-") && parsed.file === undefined)
					parsed.file = arg;
		}
	}
	return parsed;
}
