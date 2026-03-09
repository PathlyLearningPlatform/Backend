import { SectionDto } from '@/app/sections/dtos';
import { Section } from '@pathly-backend/contracts/learning-paths/v1/sections.js';

export function sectionDtoToClient(dto: SectionDto): Section {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		learningPathId: dto.learningPathId,
		unitCount: dto.unitCount,
	};
}
