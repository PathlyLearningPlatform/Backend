import type { OffsetPagination } from '@/app/common';
import type { ListUnitProgressDto, UnitDto, UnitProgressDto } from '../dtos';

type UnitFilter = {
	options?: OffsetPagination;
	where?: {
		sectionId?: string;
	};
};

export interface IUnitReadRepository {
	list(filter?: UnitFilter): Promise<UnitDto[]>;
	findById(id: string): Promise<UnitDto | null>;
}

export interface IUnitProgressReadRepository {
	list(dto?: ListUnitProgressDto): Promise<UnitProgressDto[]>;

	findOneForUser(
		unitId: string,
		userId: string,
	): Promise<UnitProgressDto | null>;
}
