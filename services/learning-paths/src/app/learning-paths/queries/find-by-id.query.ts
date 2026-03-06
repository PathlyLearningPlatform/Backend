import { IQueryHandler, LearningPathNotFoundException } from '@/app/common';
import { ILearningPathReadRepository } from '../interfaces';
import { LearningPathDto } from '../dtos';

type FindLearningPathByIdQuery = {
	where: {
		id: string;
	};
};
type FindLearningPathByIdResult = LearningPathDto;

export class FindLearningPathByIdHandler
	implements
		IQueryHandler<FindLearningPathByIdQuery, FindLearningPathByIdResult>
{
	constructor(
		private readonly learningPathReadRepository: ILearningPathReadRepository,
	) {}

	async execute(
		query: FindLearningPathByIdQuery,
	): Promise<FindLearningPathByIdResult> {
		const learningPath = await this.learningPathReadRepository.findById(
			query.where.id,
		);

		if (!learningPath) {
			throw new LearningPathNotFoundException(query.where.id);
		}

		return learningPath;
	}
}
