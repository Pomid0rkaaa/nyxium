import { NyxiumError } from "../../code/errors.js";
import { Token } from "../lexer/token.js";
import { TokenKind } from "../lexer/tokenKind.js";
import { Program } from "../ast/program.js";
import { Statement } from "../ast/statements.js";

export class Parser {
	private current = 0;

	constructor(
		private tokens: Token[],
		private source = "",
	) {}

	parse(): Program {
		const statements: Statement[] = [];
		while (!this.isEnd()) statements.push(this.statement());
		return { statements };
	}

	private statement(): Statement {
		const token = this.peek();
		switch (token.kind) {
			case TokenKind.VariableOperation:
				return this.variableOperation();
			case TokenKind.Arithmetic:
				return this.arithmetic();
			case TokenKind.StackOperation:
				return this.stackOperation();
			case TokenKind.LoopStart:
				return this.loop();
			case TokenKind.ConditionStart:
				return this.condition();
			default:
				throw this.error(`Unexpected token '${token.lexeme}'`);
		}
	}

	private variableOperation(): Statement {
		const token = this.advance();
		const lexeme = token.lexeme;
		const register = lexeme[0];
		const operation = lexeme[1];
		switch (operation) {
			case "+":
				return {
					type: "Variable",
					operation: "Increment",
					register,
					amount: lexeme.length - 1,
				};
			case "-":
				return {
					type: "Variable",
					operation: "Decrement",
					register,
					amount: lexeme.length - 1,
				};
			case ".":
				return {
					type: "Variable",
					operation: "Print",
					register,
				};
			case ":":
				return {
					type: "Variable",
					operation: "PrintChar",
					register,
				};
			case "?":
				return {
					type: "Variable",
					operation: "Push",
					register,
				};
			case "!":
				return {
					type: "Variable",
					operation: "Pop",
					register,
				};
			case "&":
				return {
					type: "Variable",
					operation: "Input",
					register,
				};
			case "'":
				return {
					type: "Variable",
					operation: "Negate",
					register,
				};
			case "$":
				return {
					type: "Variable",
					operation: "Random",
					register,
				};
			default:
				throw this.error(
					`Unknown variable operation '${lexeme}'`,
					token,
				);
		}
	}

	private arithmetic(): Statement {
		const token = this.advance();
		const lexeme = token.lexeme;
		return {
			type: "Arithmetic",
			left: lexeme[0],
			right: lexeme[1],
			operator: lexeme[3] as "+" | "-" | "*" | "/",
			action: this.arithmeticAction(lexeme[4]),
		};
	}

	private arithmeticAction(
		ch: string,
	): "Print" | "PrintChar" | "Store" | "Push" {
		switch (ch) {
			case ".":
				return "Print";
			case ":":
				return "PrintChar";
			case "!":
				return "Store";
			case "?":
				return "Push";
			default:
				throw this.error(`Unknown arithmetic action '${ch}'`);
		}
	}

	private stackOperation(): Statement {
		const token = this.advance();
		const lexeme = token.lexeme;
		switch (lexeme) {
			case "!":
				return {
					type: "Stack",
					operation: "Print",
				};
			case "!:":
				return {
					type: "Stack",
					operation: "PrintChar",
				};
			case "~":
				return {
					type: "Stack",
					operation: "Swap",
				};
			case "_":
				return {
					type: "Stack",
					operation: "Drop",
				};
			default:
				throw this.error(`Unknown stack operation '${lexeme}'`, token);
		}
	}

	private loop(): Statement {
		const lexeme = this.advance().lexeme;
		const registers = lexeme.slice(0, -1).split("");
		const body: Statement[] = [];
		while (!this.check(TokenKind.LoopEnd)) {
			if (this.isEnd()) throw this.error("Unclosed loop");
			body.push(this.statement());
		}
		this.advance(); // consume }
		return {
			type: "Loop",
			registers,
			body,
		};
	}

	private condition(): Statement {
		const left = this.advance().lexeme;

		let operator: "=" | ">" | "<" | "^" = "^";
		let right = "0";

		// x=y(...)
		if (this.check(TokenKind.Operator)) {
			operator = this.advance().lexeme as "=" | ">" | "<" | "^";
			right = this.advance().lexeme;
		}

		this.consume(TokenKind.LeftParen);

		const thenBranch: Statement[] = [];

		while (
			!this.check(TokenKind.Pipe) &&
			!this.check(TokenKind.RightParen)
		) {
			thenBranch.push(this.statement());
		}

		let elseBranch: Statement[] = [];

		if (this.match(TokenKind.Pipe)) {
			while (!this.check(TokenKind.RightParen)) {
				elseBranch.push(this.statement());
			}
		}

		this.consume(TokenKind.RightParen);

		return {
			type: "Condition",
			left,
			operator,
			right,
			thenBranch,
			elseBranch,
		};
	}

	private peek = (): Token => this.tokens[this.current];
	private previous = (): Token => this.tokens[this.current - 1];
	private advance = (): Token => this.tokens[this.current++];
	private isEnd = (): boolean => this.peek().kind === TokenKind.EOF;
	private check = (kind: TokenKind): boolean =>
		!this.isEnd() && this.peek().kind === kind;
	private error(message: string, token?: Token): NyxiumError {
		const target =
			token ?? (this.current > 0 ? this.previous() : this.peek());

		return new NyxiumError({
			kind: "parser",
			message,
			line: target.line,
			column: target.column,
			source: this.source,
			length: Math.max(1, target.lexeme.length),
		});
	}
	private consume(kind: TokenKind): Token {
		if (!this.check(kind)) throw this.error(`Expected ${kind}`);
		return this.advance();
	}
	private match(kind: TokenKind): boolean {
		if (!this.check(kind)) return false;
		this.advance();
		return true;
	}
}
