import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	Logger,
	type PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { HttpErrorDto } from '../dtos/http-error.dto';

@Injectable()
export class HttpValidationPipe implements PipeTransform {
	private logger = new Logger(HttpValidationPipe.name);

	constructor(private readonly schema: ZodType) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value);

			return parsedValue;
		} catch (err) {
			if (err instanceof ZodError) {
				const validationErrors = [
					...err.issues.map((issue) => {
						return {
							fields: issue.path.length > 0 ? issue.path : null,
							code: issue.code,
							message: issue.message,
						};
					}),
				];

				throw new BadRequestException(
					new HttpErrorDto(err.message, validationErrors),
				);
			}

			throw new BadRequestException(
				new HttpErrorDto('Internal error. Please try again later.', null),
			);
		}
	}
}
