import { OffsetPagination } from '@/app/common';
import { UnitDto } from '../dtos';

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
