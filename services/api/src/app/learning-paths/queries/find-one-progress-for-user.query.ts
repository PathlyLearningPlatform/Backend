import type { IQueryHandler } from '@/app/common';
import type { LearningPathProgressDto } from '../dtos';
import { LearningPathProgressNotFoundException } from '../exceptions';
import {
	ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindLearningPathProgressForUserQuery = {
	learningPathId: string;
	userId: string;
};
export type FindLearningPathProgressForUserResult = LearningPathProgressDto;

export class FindLearningPathProgressForUserHandler
	implements
		IQueryHandler<
			FindLearningPathProgressForUserQuery,
			FindLearningPathProgressForUserResult
		>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(
		query: FindLearningPathProgressForUserQuery,
	): Promise<LearningPathProgressDto> {
		const progressId = LearningPathProgressId.create(
			LearningPathId.create(UUID.create(query.learningPathId)),
			UserId.create(UUID.create(query.userId)),
		);
		const progress =
			await this.learningPathProgressRepository.findById(progressId);

		if (!progress) {
			throw new LearningPathProgressNotFoundException('');
		}

		return progressAggregateToDto(progress);
	}
}
