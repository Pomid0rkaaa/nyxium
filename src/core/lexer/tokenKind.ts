export enum TokenKind {
	VariableOperation,
	Arithmetic,

	LoopStart,
	LoopEnd,

	ConditionStart,
	Operator,
	Register,

	LeftParen,
	RightParen,
	Pipe,

	StackOperation,

	EOF,
}