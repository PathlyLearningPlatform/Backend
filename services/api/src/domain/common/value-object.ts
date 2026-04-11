export abstract class ValueObject<T extends object> {
	protected readonly _props: T;

	constructor(props: T) {
		this._props = Object.freeze(props);
	}

	equals(other: ValueObject<T>): boolean {
		return JSON.stringify(this._props) === JSON.stringify(other._props);
	}
}
