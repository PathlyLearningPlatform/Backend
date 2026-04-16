import { type IQueryHandler, SectionNotFoundException } from '@/app/common';
import type { SectionDto } from '../dtos';
import { ISectionRepository, SectionId } from '@/domain/sections';
import { aggregateToDto } from '../helpers';

type FindSectionByIdQuery = {
	where: {
		id: string;
	};
};
type FindSectionByIdResult = SectionDto;

export class FindSectionByIdHandler
	implements IQueryHandler<FindSectionByIdQuery, FindSectionByIdResult>
{
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(query: FindSectionByIdQuery): Promise<FindSectionByIdResult> {
		const sectionId = SectionId.create(query.where.id);
		const section = await this.sectionRepository.findById(sectionId);

		if (!section) {
			throw new SectionNotFoundException(query.where.id);
		}

		return aggregateToDto(section);
	}
}
