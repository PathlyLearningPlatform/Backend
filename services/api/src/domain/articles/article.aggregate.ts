import { AggregateRoot, Url, UUID } from '@/domain/common';
import { ArticleId } from './value-objects';

type ArticleProps = {
	name: string;
	description: string | null;
	ref: Url;
	createdAt: Date;
	updatedAt: Date | null;
};
type CreateArticleProps = {
	name: string;
	description?: string;
	ref: Url;
	createdAt: Date;
};
type ArticleFromDataSourceProps = {
	id: string;
	name: string;
	description: string | null;
	ref: string;
	createdAt: Date;
	updatedAt: Date | null;
};
type UpdateArticleProps = Partial<{
	name: string;
	description: string | null;
	ref: Url;
}>;

export class Article extends AggregateRoot<ArticleId, ArticleProps> {
	protected readonly _props: ArticleProps;

	private constructor(id: ArticleId, props: ArticleProps) {
		super(id);
		this._props = props;
	}

	static create(id: ArticleId, props: CreateArticleProps): Article {
		return new Article(id, {
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			ref: props.ref,
		});
	}

	static fromDataSource(props: ArticleFromDataSourceProps): Article {
		return new Article(ArticleId.create(UUID.create(props.id)), {
			name: props.name,
			description: props.description,
			ref: Url.create(props.ref),
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	get id(): ArticleId {
		return this._id;
	}
	get createdAt(): Date {
		return this._props.createdAt;
	}
	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
	get name(): string {
		return this._props.name;
	}
	get description(): string | null {
		return this._props.description;
	}
	get ref(): Url {
		return this._props.ref;
	}

	update(now: Date, props?: UpdateArticleProps): void {
		this._props.updatedAt = now;

		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.ref) {
			this._props.ref = props.ref;
		}
	}
}
