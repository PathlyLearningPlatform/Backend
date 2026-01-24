export interface IArticle {
	ref: string;
	activityId: string;
}

export type ArticleRequiredCreateFields = Pick<IArticle, 'ref' | 'activityId'>;
// export type ArticleAllowedCreateFields = {};
export type ArticleCreateFields =
	ArticleRequiredCreateFields /* & ArticleAllowedCreateFields */;

export type ArticleUpdateFields = Partial<Omit<IArticle, 'activityId'>>;

export class Article implements IArticle {
	constructor(fields: IArticle) {
		this.activityId = fields.activityId;
		this.ref = fields.ref;
	}

	update(fields: ArticleUpdateFields) {
		if (fields.ref) {
			this.ref = fields.ref;
		}
	}

	ref: string;
	activityId: string;
}
