import { Program } from "../ast/program.js";
import * as ST from "../ast/statements.js";
import { Environment } from "./environment.js";

export class Interpreter {
	private env = new Environment();
	private memory: number[] = [];
	private output = "";
	private stdinValues: number[] = [];
	private stdinIndex = 0;

	interpret(program: Program, stdin = ""): string {
		this.reset();
		this.stdinValues = this.parseStdin(stdin);
		this.execute(program.statements);
		return this.output;
	}

	private reset() {
		this.env.reset();
		this.memory = [];
		this.output = "";
		this.stdinValues = [];
		this.stdinIndex = 0;
	}

	private parseStdin(stdin: string): number[] {
		if (!stdin) return [];
		return stdin.split(";").map((value) => {
			const s = value.trim();
			if (s.endsWith(":") && s.length > 1) return s.charCodeAt(0);
			const n = Number(s);
			return Number.isNaN(n) ? 0 : n;
		});
	}

	private execute(statements: ST.Statement[]) {
		for (const statement of statements) this.executeStatement(statement);
	}

	private executeStatement(statement: ST.Statement) {
		switch (statement.type) {
			case "Variable":
				this.executeVariable(statement);
				break;
			case "Arithmetic":
				this.executeArithmetic(statement);
				break;
			case "Stack":
				this.executeStack(statement);
				break;
			case "Loop":
				this.executeLoop(statement);
				break;
			case "Condition":
				this.executeCondition(statement);
				break;
		}
	}

	private executeVariable(statement: ST.VariableStatement) {
		const value = this.env.get(statement.register);
		switch (statement.operation) {
			case "Increment":
				this.env.inc(statement.register, statement.amount!);
				break;
			case "Decrement":
				this.env.inc(statement.register, -statement.amount!);
				break;
			case "Print":
				this.output += value + " ";
				break;
			case "PrintChar":
				this.output += String.fromCharCode(value);
				break;
			case "Push":
				this.memory.push(value);
				break;
			case "Pop":
				this.env.set(statement.register, this.memory.pop() ?? 0);
				break;
			case "Input":
				this.env.set(
					statement.register,
					this.stdinIndex < this.stdinValues.length
						? this.stdinValues[this.stdinIndex++]
						: 0,
				);
				break;
			case "Negate":
				this.env.set(statement.register, -value);
				break;
			case "Random":
				this.env.set(
					statement.register,
					Math.floor(Math.random() * (Math.max(0, value) + 1)),
				);
				break;
		}
	}

	private executeArithmetic(statement: ST.ArithmeticStatement) {
		const left = this.env.get(statement.left);
		const right = this.env.get(statement.right);
		let result = 0;
		switch (statement.operator) {
			case "+":
				result = left + right;
				break;
			case "-":
				result = left - right;
				break;
			case "*":
				result = left * right;
				break;
			case "/":
				result = right !== 0 ? Math.floor(left / right) : 0;
				break;
		}
		switch (statement.action) {
			case "Print":
				this.output += result + " ";
				break;
			case "PrintChar":
				this.output += String.fromCharCode(result);
				break;
			case "Store":
				this.env.set(statement.left, result);
				break;
			case "Push":
				this.memory.push(result);
				break;
		}
	}

	private executeLoop(statement: ST.LoopStatement) {
		let count = 0;
		while (statement.registers.some((r: string) => this.env.get(r) !== 0)) {
			if (++count > 1e4) throw new Error("Loop iteration limit exceeded");
			this.execute(statement.body);
		}
	}

	private executeCondition(statement: ST.ConditionStatement) {
		const left = this.env.get(statement.left);
		const right =
			statement.right === "0" ? 0 : this.env.get(statement.right);
		let result = false;

		switch (statement.operator) {
			case "=":
				result = left === right;
				break;
			case ">":
				result = left > right;
				break;
			case "<":
				result = left < right;
				break;
			case "^":
				result = left !== right;
				break;
		}
		if (result) this.execute(statement.thenBranch);
		else this.execute(statement.elseBranch);
	}

	private executeStack(statement: ST.StackStatement) {
		switch (statement.operation) {
			case "Print":
				this.output += (this.memory.pop() ?? 0) + " ";
				break;
			case "PrintChar":
				this.output += String.fromCharCode(this.memory.pop() ?? 0);
				break;
			case "Swap":
				if (this.memory.length >= 2) {
					const a = this.memory.pop()!;
					const b = this.memory.pop()!;
					this.memory.push(a, b);
				}
				break;
			case "Drop":
				this.memory.pop();
				break;
		}
	}
}
