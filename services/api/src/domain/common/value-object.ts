export abstract class ValueObject<T extends object> {
	protected readonly _props: T;

	constructor(props: T) {
		this._props = Object.freeze(props);
	}

	equals(other: ValueObject<T>): boolean {
		return this.recursiveEqual(this._props, other._props);
	}

	private recursiveEqual(obj1: object, obj2: object): boolean {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			if (val1 instanceof ValueObject && val2 instanceof ValueObject) {
				if (!val1.equals(val2)) {
					return false;
				}
			} else if (val1 !== val2) {
				return false;
			}
		}

		return true;
	}
}
