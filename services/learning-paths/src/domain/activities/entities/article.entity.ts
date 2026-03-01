import {
	Activity,
	ActivityCreateFields,
	type ActivityFields,
	type ActivityUpdateFields,
} from './activity.entity';

export interface ArticleFields extends ActivityFields {
	ref: string;
}

export type ArticleCreateFields = ActivityCreateFields &
	Pick<ArticleFields, 'ref'> &
	Partial<ArticleFields>;
export type ArticleUpdateFields = ActivityUpdateFields &
	Partial<Pick<ArticleFields, 'ref'>>;

export class Article extends Activity implements ArticleFields {
	constructor(fields: ArticleCreateFields) {
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
