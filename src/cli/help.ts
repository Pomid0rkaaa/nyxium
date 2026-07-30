export function printHelp(): void {
	console.log(`
Usage:
  nyxium [options] [file]

Options:
  -c, --code <code>  Execute inline code
  -h, --help         Show this help message

Examples:
  nyxium script.nyx
  nyxium -c "x."
  printf '42' | nyxium script.nyx
`);
}
