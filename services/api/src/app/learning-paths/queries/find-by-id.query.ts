import {
	type IQueryHandler,
	LearningPathNotFoundException,
} from '@/app/common';
import type { LearningPathDto } from '../dtos';
import {
	ILearningPathRepository,
	LearningPathId,
} from '@/domain/learning-paths';
import { UUID } from '@/domain/common';
import { aggregateToDto } from '../helpers';

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
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(
		query: FindLearningPathByIdQuery,
	): Promise<FindLearningPathByIdResult> {
		const learningPathId = LearningPathId.create(UUID.create(query.where.id));
		const learningPath =
			await this.learningPathRepository.findById(learningPathId);

		if (!learningPath) {
			throw new LearningPathNotFoundException(query.where.id);
		}

		return aggregateToDto(learningPath);
	}
}
