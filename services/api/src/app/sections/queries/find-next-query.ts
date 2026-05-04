import { IQueryHandler, SectionNotFoundException } from '@/app/common';
import { SectionDto } from '../dtos';
import { ISectionRepository, SectionId } from '@/domain/sections';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindNextSectionQuery = {
	id: string;
};

export class FindNextSectionHandler
	implements IQueryHandler<FindNextSectionQuery, SectionDto>
{
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(command: FindNextSectionQuery): Promise<SectionDto> {
		const id = SectionId.create(command.id);
		const section = await this.sectionRepository.findById(id);

		if (!section) {
			throw new SectionNotFoundException(command.id);
		}

		const nextOrder = Order.create(section.order.value + 1);
		const next = await this.sectionRepository.findByLearningPathIdAndOrder(
			section.learningPathId,
			nextOrder,
		);

		if (!next) {
			throw new SectionNotFoundException('');
		}

		return aggregateToDto(next);
	}
}
