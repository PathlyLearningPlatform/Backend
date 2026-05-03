import { ValueObject } from '../value-object';

type Props = {
	value: number;
};

export class RepositoryId extends ValueObject<Props> {
	private readonly _brand: 'repositoryId' = 'repositoryId';

	get value(): number {
		return this._props.value;
	}

	primitve(): number {
		return this._props.value;
	}

	static create(value: number): RepositoryId {
		return new RepositoryId({ value });
	}
}
