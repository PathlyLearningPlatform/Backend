import type { SectionDto, SectionProgressDto } from '@/app/sections/dtos';
import type { SectionProgressResponseDto, SectionResponseDto } from '../dtos';

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

export function clientSectionProgressToResponseDto(
	progress: SectionProgressDto,
): SectionProgressResponseDto {
	return {
		id: progress.id,
		sectionId: progress.sectionId,
		learningPathId: progress.learningPathId,
		userId: progress.userId,
		completedAt: progress.completedAt?.toISOString() ?? null,
		totalUnitCount: progress.totalUnitCount,
		completedUnitCount: progress.completedUnitCount,
	};
}
