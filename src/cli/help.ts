export function printHelp(): void {
	console.log(`
Usage:
  nyxium [options] [file]

Options:
  -c, --code  <code>    Execute inline code
  -i, --input <string>  Program input (;-separated, e.g. 3;A:;42)
  -h, --help            Show this help message

Examples:
  nyxium script.nyx
  nyxium -c "x."
  nyxium -i "3;5" -c "x& x. y& y."
  echo '42' | nyxium script.nyx
`);
}
