import {
	Activity,
	ActivityAllowedCreateProps,
	ActivityProps,
	ActivityRequiredCreateProps,
	ActivityUpdateProps,
} from './activity.entity';

export interface ArticleProps extends ActivityProps {
	ref: string;
}

export type ArticleRequiredCreateProps = Pick<ArticleProps, 'ref'> &
	ActivityRequiredCreateProps;
export type ArticleAllowedCreateProps = ActivityAllowedCreateProps;
export type ArticleCreateProps = ArticleRequiredCreateProps &
	ArticleAllowedCreateProps;
export type ArticleUpdateProps = ActivityUpdateProps &
	Partial<Pick<ArticleProps, 'ref'>>;

export class Article extends Activity implements ArticleProps {
	constructor(props: ArticleProps) {
		super(props);

		this.ref = props.ref;
	}

	update(props: ArticleUpdateProps) {
		super.update(props);

		if (props.ref) {
			this.ref = props.ref;
		}
	}

	ref: string;
}
