import { UUID } from './value-objects';

export abstract class Entity<T> {
	protected readonly _id: UUID;

	constructor(id: UUID) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	equals(other: Entity<T>): boolean {
		return this._id.equals(other._id);
	}
}
