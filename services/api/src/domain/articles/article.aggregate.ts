import { AggregateRoot, Order, Url } from '@/domain/common';
import { LessonId } from '@/domain/lessons/value-objects';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from '../activities';

type ArticleProps = {
	ref: Url;
	lessonId: LessonId;
	createdAt: Date;
	updatedAt: Date | null;
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
	type: ActivityType;
};
type CreateArticleProps = {
	lessonId: LessonId;
	createdAt: Date;
	name: ActivityName;
	description?: ActivityDescription | null;
	order: Order;
	ref: Url;
};
type ArticleFromDataSourceProps = {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	ref: string;
};
type UpdateArticleProps = Partial<{
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
	ref: Url;
}>;

export class Article extends AggregateRoot<ActivityId, ArticleProps> {
	protected readonly _props: ArticleProps;

	private constructor(id: ActivityId, props: ArticleProps) {
		super(id);
		this._props = props;
	}

	static create(id: ActivityId, props: CreateArticleProps): Article {
		return new Article(id, {
			lessonId: props.lessonId,
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			order: props.order,
			type: ActivityType.ARTICLE,
			ref: props.ref,
		});
	}

	static fromDataSource(props: ArticleFromDataSourceProps): Article {
		return new Article(ActivityId.create(props.id), {
			lessonId: LessonId.create(props.lessonId),
			name: ActivityName.create(props.name),
			description: props.description
				? ActivityDescription.create(props.description)
				: null,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			order: Order.create(props.order),
			type: ActivityType.ARTICLE,
			ref: Url.create(props.ref),
		});
	}

	get id(): ActivityId {
		return this._id;
	}
	get lessonId(): LessonId {
		return this._props.lessonId;
	}
	get createdAt(): Date {
		return this._props.createdAt;
	}
	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
	get name(): ActivityName {
		return this._props.name;
	}
	get description(): ActivityDescription | null {
		return this._props.description;
	}
	get order(): Order {
		return this._props.order;
	}
	get type(): ActivityType {
		return this._props.type;
	}

	get ref(): Url {
		return this._props.ref;
	}

	update(now: Date, props?: UpdateArticleProps): void {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.order) {
			this._props.order = props.order;
		}

		if (props?.ref) {
			this._props.ref = props.ref;
		}

		this._props.updatedAt = now;
	}
}
