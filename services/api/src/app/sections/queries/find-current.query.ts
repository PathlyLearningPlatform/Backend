import { IQueryHandler, SectionNotFoundException } from '@/app/common';
import { SectionProgressDto } from '../dtos';
import { ISectionProgressRepository } from '@/domain/sections';
import { LearningPathId } from '@/domain/learning-paths';
import { UserId, UUID } from '@/domain/common';
import { SectionProgressNotFoundException } from '../exceptions';
import { aggregateToDto, progressAggregateToDto } from '../helpers';

export type FindCurrentSectionQuery = {
	learningPathId: string;
	userId: string;
};

export class FindCurrentSectionHandler
	implements IQueryHandler<FindCurrentSectionQuery, SectionProgressDto>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
	) {}

	async execute(command: FindCurrentSectionQuery): Promise<SectionProgressDto> {
		const learningPathId = LearningPathId.create(command.learningPathId);
		const userId = UserId.create(UUID.create(command.userId));

		const current = await this.sectionProgressRepository.findCurrent(
			learningPathId,
			userId,
		);

		if (!current) {
			throw new SectionProgressNotFoundException('');
		}

		return progressAggregateToDto(current);
	}
}
