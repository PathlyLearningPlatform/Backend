import { ListUnitProgressDto, UnitProgressDto } from '../dtos';

export interface IUnitProgressReadRepository {
	list(dto?: ListUnitProgressDto): Promise<UnitProgressDto[]>;

	findById(id: string): Promise<UnitProgressDto | null>;

	findForUser(unitId: string, userId: string): Promise<UnitProgressDto | null>;
}
