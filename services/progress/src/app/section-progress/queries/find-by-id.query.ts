import { IQueryHandler } from '@/app/common';
import { SectionProgressDto } from '../dtos';
import { ISectionProgressReadRepository } from '../interfaces';
import { SectionProgressNotFoundException } from '../exceptions';

export type FindSectionProgressByIdQuery = {
	id: string;
};
export type FindSectionProgressByIdResult = SectionProgressDto;

export class FindSectionProgressByIdHandler
	implements
		IQueryHandler<FindSectionProgressByIdQuery, FindSectionProgressByIdResult>
{
	constructor(
		private readonly lessonProgressReadRepository: ISectionProgressReadRepository,
	) {}

	async execute(
		query: FindSectionProgressByIdQuery,
	): Promise<SectionProgressDto> {
		const lessonProgress = await this.lessonProgressReadRepository.findById(
			query.id,
		);

		if (!lessonProgress) {
			throw new SectionProgressNotFoundException(query.id);
		}

		return lessonProgress;
	}
}
