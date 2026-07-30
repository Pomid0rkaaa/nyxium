export type Statement =
	| VariableStatement
	| ArithmeticStatement
	| StackStatement
	| LoopStatement
	| ConditionStatement;

export interface VariableStatement {
	type: "Variable";
	operation:
		| "Increment"
		| "Decrement"
		| "Print"
		| "PrintChar"
		| "Push"
		| "Pop"
		| "Input"
		| "Negate"
		| "Random";

	register: string;
	amount?: number;
}

export interface ArithmeticStatement {
	type: "Arithmetic";
	left: string;
	right: string;
	operator: "+" | "-" | "*" | "/";
	action: "Print" | "PrintChar" | "Store" | "Push";
}

export interface StackStatement {
	type: "Stack";
	operation: "Print" | "PrintChar" | "Swap" | "Drop";
}

export interface LoopStatement {
	type: "Loop";
	registers: string[];
	body: Statement[];
}

export interface ConditionStatement {
	type: "Condition";
	left: string;
	operator: "=" | ">" | "<" | "^";
	right: string;
	thenBranch: Statement[];
	elseBranch: Statement[];
}
