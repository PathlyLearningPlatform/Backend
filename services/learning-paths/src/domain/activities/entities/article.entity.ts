import {
	Activity,
	type ActivityAllowedCreateFields,
	type ActivityFields,
	type ActivityRequiredCreateFields,
	type ActivityUpdateFields,
} from './activity.entity';

export interface ArticleFields extends ActivityFields {
	ref: string;
}

export type ArticleRequiredCreateFields = Pick<ArticleFields, 'ref'> &
	ActivityRequiredCreateFields;
export type ArticleAllowedCreateFields = ActivityAllowedCreateFields;
export type ArticleCreateFields = ArticleRequiredCreateFields &
	ArticleAllowedCreateFields;
export type ArticleUpdateFields = ActivityUpdateFields &
	Partial<Pick<ArticleFields, 'ref'>>;

export class Article extends Activity implements ArticleFields {
	constructor(fields: ArticleFields) {
		super(fields);

		this.ref = fields.ref;
	}

	update(fields: ArticleUpdateFields) {
		super.update(fields);

		if (fields.ref !== undefined) {
			this.ref = fields.ref;
		}
	}

	ref: string;
}
