import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ArticleId extends ValueObject<Props> {
	private readonly _brand: 'articleId' = 'articleId';

	get value(): UUID {
		return this._props.value;
	}

	primitive(): string {
		return this._props.value.value;
	}

	static create(value: UUID): ArticleId {
		return new ArticleId({ value });
	}
}
