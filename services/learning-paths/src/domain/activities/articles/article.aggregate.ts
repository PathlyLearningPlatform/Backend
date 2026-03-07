import {
	Activity,
	ActivityFromDataSourceProps,
	ActivityProps,
	CreateActivityProps,
	UpdateActivityProps,
} from '../activity.aggregate';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from '../value-objects';
import { LessonId } from '@/domain/lessons/value-objects';
import { Order, Url } from '@/domain/common';

type ArticleProps = ActivityProps & {
	ref: Url;
};
type CreateArticleProps = Omit<
	CreateActivityProps & {
		ref: Url;
	},
	'type'
>;
type ArticleFromDataSourceProps = Omit<
	ActivityFromDataSourceProps & {
		ref: string;
	},
	'type'
>;
type UpdateArticleProps = UpdateActivityProps &
	Partial<{
		ref: Url;
	}>;

export class Article extends Activity {
	protected readonly _props: ArticleProps;

	private constructor(id: ActivityId, props: ArticleProps) {
		super(id, props);
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

	get ref(): Url {
		return this._props.ref;
	}

	update(now: Date, props?: UpdateArticleProps): void {
		super.update(now, props);

		if (props?.ref) {
			this._props.ref = props.ref;
		}
	}
}
