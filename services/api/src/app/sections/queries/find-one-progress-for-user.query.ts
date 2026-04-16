import type { IQueryHandler } from '@/app/common';
import type { SectionProgressDto } from '../dtos';
import { SectionProgressNotFoundException } from '../exceptions';
import {
	ISectionProgressRepository,
	SectionId,
	SectionProgressId,
} from '@/domain/sections';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindSectionProgressForUserQuery = {
	sectionId: string;
	userId: string;
};
export type FindSectionProgressForUserResult = SectionProgressDto;

export class FindSectionProgressForUserHandler
	implements
		IQueryHandler<
			FindSectionProgressForUserQuery,
			FindSectionProgressForUserResult
		>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
	) {}

	async execute(
		query: FindSectionProgressForUserQuery,
	): Promise<SectionProgressDto> {
		const progressId = SectionProgressId.create(
			SectionId.create(query.sectionId),
			UserId.create(UUID.create(query.userId)),
		);
		const sectionProgress =
			await this.sectionProgressRepository.findById(progressId);

		if (!sectionProgress) {
			throw new SectionProgressNotFoundException('');
		}

		return progressAggregateToDto(sectionProgress);
	}
}
