import { NyxiumError } from "../../code/errors.js";

export type Value = number;

export class Environment {
	private values = new Map<string, Value>();

	constructor() {
		this.reset();
	}

	reset() {
		this.values.clear();
		for (const register of ["x", "y", "z", "a", "b", "c"])
			this.values.set(register, 0);
	}

	get(name: string): number {
		const value = this.values.get(name);
		if (typeof value !== "number")
			throw new NyxiumError({
				kind: "runtime",
				message: `'${name}' is not a number`,
			});
		return value;
	}

	has = (name: string): boolean => this.values.has(name);
	dump = () => Object.fromEntries(this.values);
	set = (name: string, value: number) => this.values.set(name, value);
	inc = (name: string, amount: number) =>
		this.set(name, this.get(name) + amount);
}
