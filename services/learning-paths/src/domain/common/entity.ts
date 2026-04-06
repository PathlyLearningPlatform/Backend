import type { ValueObject } from "./value-object";

export abstract class Entity<ID extends ValueObject<object>, Props> {
	protected readonly _id: ID;

	constructor(id: ID) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	equals(other: Entity<ID, Props>): boolean {
		return this._id.equals(other._id);
	}
}
