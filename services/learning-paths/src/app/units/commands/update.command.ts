import type { UnitUpdateFields } from '@/domain/units/entities';

export type UpdateUnitCommand = {
	where: {
		id: string;
	};
	fields?: UnitUpdateFields;
};
