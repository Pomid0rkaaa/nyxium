import { Token } from "./token.js";
import { TokenKind } from "./tokenKind.js";

export class Lexer {
	private current = 0;
	private line = 1;
	private column = 1;

	private variables = new Set(["x", "y", "z", "a", "b", "c"]);
	private pending: Token[] = [];

	constructor(private source: string) {}

	scan(): Token[] {
		const tokens: Token[] = [];
		this.flushPending(tokens);
		while (!this.isEnd()) {
			this.flushPending(tokens);
			const ch = this.peek();
            if (ch === "#") {
				while (!this.isEnd() && this.peek() !== "\n") {
					this.advance();
				}
				continue;
			}
			if (this.isWhitespace(ch)) {
				this.advance();
				continue;
			}
			const startLine = this.line;
			const startColumn = this.column;
			if (this.isVariable(ch)) {
				tokens.push(this.scanVariable(startLine, startColumn));
				continue;
			}
			switch (ch) {
				case "}":
					this.advance();
					tokens.push({
						kind: TokenKind.LoopEnd,
						lexeme: "}",
						line: startLine,
						column: startColumn,
					});
					break;

				case "!":
					tokens.push(this.scanStack(startLine, startColumn));
					break;

				case "(":
					this.advance();
					tokens.push({
						kind: TokenKind.LeftParen,
						lexeme: "(",
						line: startLine,
						column: startColumn,
					});
					break;

				case ")":
					this.advance();
					tokens.push({
						kind: TokenKind.RightParen,
						lexeme: ")",
						line: startLine,
						column: startColumn,
					});
					break;

				case "|":
					this.advance();
					tokens.push({
						kind: TokenKind.Pipe,
						lexeme: "|",
						line: startLine,
						column: startColumn,
					});
					break;

				case "~":
				case "_":
					this.advance();
					tokens.push({
						kind: TokenKind.StackOperation,
						lexeme: ch,
						line: startLine,
						column: startColumn,
					});
					break;

				default:
					throw this.error(`unknown character '${ch}'`);
			}
		}
		this.flushPending(tokens);
		tokens.push(this.makeToken(TokenKind.EOF, ""));
		return tokens;
	}

	private flushPending(tokens: Token[]): void {
		while (this.pending.length > 0) {
			tokens.push(this.pending.shift()!);
		}
	}

	private scanVariable(line: number, column: number): Token {
		const start = this.current;

		const variable = this.advance();

		// x{ or xy{
		if (this.peek() === "{" || this.isVariable(this.peek())) {
			let registers = variable;

			if (this.isVariable(this.peek())) {
				registers += this.advance();
			}

			if (this.peek() === "{") {
				this.advance();

				return {
					kind: TokenKind.LoopStart,
					lexeme: registers + "{",
					line,
					column,
				};
			}

			// xy[+.!]
			if (this.peek() === "[") {
				while (!this.isEnd() && this.peek() !== "]") {
					this.advance();
				}

				if (this.peek() === "]") {
					this.advance();
				}

				return {
					kind: TokenKind.Arithmetic,
					lexeme: this.source.slice(start, this.current),
					line,
					column,
				};
			}

			throw this.error("invalid variable sequence");
		}

		// x=y(...), x>y(...), x<y(...), x^y(...)
		if (
			this.peek() === "=" ||
			this.peek() === ">" ||
			this.peek() === "<" ||
			this.peek() === "^"
		) {
			const op = this.advance();

			if (!this.isVariable(this.peek())) {
				throw this.error("expected register after condition operator");
			}

			const right = this.advance();

			if (this.peek() !== "(") {
				throw this.error("expected '(' after condition");
			}

			this.pending.push(
				{
					kind: TokenKind.Operator,
					lexeme: op,
					line,
					column,
				},
				{
					kind: TokenKind.Register,
					lexeme: right,
					line,
					column,
				},
			);

			return {
				kind: TokenKind.ConditionStart,
				lexeme: variable,
				line,
				column,
			};
		}

		// x(...)
		if (this.peek() === "(") {
			return {
				kind: TokenKind.ConditionStart,
				lexeme: variable,
				line,
				column,
			};
		}

		// x++, x--, x., x:
		if (
			this.peek() === "+" ||
			this.peek() === "-" ||
			this.isVariableOperation(this.peek())
		) {
			while (this.peek() === "+" || this.peek() === "-") {
				this.advance();
			}

			if (this.isVariableOperation(this.peek())) {
				this.advance();
			}

			return {
				kind: TokenKind.VariableOperation,
				lexeme: this.source.slice(start, this.current),
				line,
				column,
			};
		}

		throw this.error("variable without operation");
	}

	private scanStack(line: number, column: number): Token {
		const start = this.current;
		this.advance();
		if (this.peek() === ":") this.advance();
		return {
			kind: TokenKind.StackOperation,
			lexeme: this.source.slice(start, this.current),
			line,
			column,
		};
	}

	private advance(): string {
		const ch = this.source[this.current++];
		if (ch === "\n") {
			this.line++;
			this.column = 1;
		} else this.column++;
		return ch;
	}
	private error = (message: string): Error =>
		new Error(`Lexer error at ${this.line}:${this.column}: ${message}`);
	private isVariableOperation = (ch: string): boolean =>
		".:?&!^$".includes(ch);
	private isWhitespace = (ch: string): boolean =>
		ch === " " || ch === "\n" || ch === "\r" || ch === "\t";
	private isVariable = (ch: string): boolean => this.variables.has(ch);
	private peek = (): string => this.source[this.current] ?? "";
	private isEnd = (): boolean => this.current >= this.source.length;
	private makeToken = (kind: TokenKind, lexeme: string): Token => ({
		kind,
		lexeme,
		line: this.line,
		column: this.column,
	});
}
