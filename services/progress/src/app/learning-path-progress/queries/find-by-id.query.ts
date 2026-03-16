import { IQueryHandler } from '@/app/common';
import { LearningPathProgressDto } from '../dtos';
import { ILearningPathProgressReadRepository } from '../interfaces';
import { LearningPathProgressNotFoundException } from '../exceptions';

export type FindLearningPathProgressByIdQuery = {
	id: string;
};
export type FindLearningPathProgressByIdResult = LearningPathProgressDto;

export class FindLearningPathProgressByIdHandler
	implements
		IQueryHandler<
			FindLearningPathProgressByIdQuery,
			FindLearningPathProgressByIdResult
		>
{
	constructor(
		private readonly lessonProgressReadRepository: ILearningPathProgressReadRepository,
	) {}

	async execute(
		query: FindLearningPathProgressByIdQuery,
	): Promise<LearningPathProgressDto> {
		const lessonProgress = await this.lessonProgressReadRepository.findById(
			query.id,
		);

		if (!lessonProgress) {
			throw new LearningPathProgressNotFoundException(query.id);
		}

		return lessonProgress;
	}
}
