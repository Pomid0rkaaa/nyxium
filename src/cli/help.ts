export function printHelp(): void {
	console.log(`
Usage:
  nyx [options] [file]

Options:
  -c, --code  <code>    Execute inline code
  -i, --input <string>  Program input (;-separated, e.g. 3;A:;42)
  -h, --help            Show this help message
  -r, --repl            Start interactive REPL

Examples:
  nyx script.nyx
  nyx -c "x."
  nyx -i "3;5" -c "x& x. y& y."
  echo '42' | nyx script.nyx
`);
}
