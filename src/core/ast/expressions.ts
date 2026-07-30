export type Expression = RegisterExpression | NumberExpression;

export interface RegisterExpression {
	type: "Register";
	name: string;
}

export interface NumberExpression {
	type: "Number";
	value: number;
}
