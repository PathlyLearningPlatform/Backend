import { UnitDto } from '@/app/units/dtos';
import { Unit } from '@pathly-backend/contracts/learning-paths/v1/units.js';

export function unitDtoToClient(dto: UnitDto): Unit {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		sectionId: dto.sectionId,
		lessonCount: dto.lessonCount,
	};
}
