import { TokenKind } from "./tokenKind.js";

export interface Token {
	kind: TokenKind;
	lexeme: string;
	line: number;
	column: number;
}
