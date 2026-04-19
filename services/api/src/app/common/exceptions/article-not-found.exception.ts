import { AppException } from './app.exception';

export class ArticleNotFoundException extends AppException {
	constructor(public readonly articleId: string) {
		const message = `Article with id = ${articleId} was not found.`;
		super(message);
	}
}
