import type { SectionProgress as ClientSectionProgress } from '@pathly-backend/contracts/learning_paths/v1/sections.js';
import type { Section } from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type { SectionDto, SectionProgressDto } from '@/app/sections/dtos';

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

export function sectionProgressDtoToClient(
	dto: SectionProgressDto,
): ClientSectionProgress {
	return {
		sectionId: dto.sectionId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalUnitCount: dto.totalUnitCount,
		completedUnitCount: dto.completedUnitCount,
		learningPathId: dto.learningPathId,
	};
}
