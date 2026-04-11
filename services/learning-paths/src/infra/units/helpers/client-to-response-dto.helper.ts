import type { UnitDto } from '@/app/units/dtos';
import type { UnitResponseDto } from '../dtos';

export function clientUnitToResponseDto(unit: UnitDto): UnitResponseDto {
	return {
		id: unit.id,
		name: unit.name,
		order: unit.order,
		createdAt: unit.createdAt.toISOString(),
		lessonCount: unit.lessonCount,
		sectionId: unit.sectionId,
		description: unit.description,
		updatedAt: unit.updatedAt ? unit.updatedAt.toISOString() : null,
	};
}
