import type { SectionDto } from '@/app/sections/dtos';
import type { SectionResponseDto } from '../dtos';

export function clientSectionToResponseDto(
	section: SectionDto,
): SectionResponseDto {
	return {
		id: section.id,
		name: section.name,
		createdAt: section.createdAt.toISOString(),
		learningPathId: section.learningPathId,
		order: section.order,
		unitCount: section.unitCount,
		description: section.description,
		updatedAt: section.updatedAt ? section.updatedAt.toISOString() : null,
	};
}
