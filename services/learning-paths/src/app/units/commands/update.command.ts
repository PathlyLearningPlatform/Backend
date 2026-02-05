import type { UnitUpdateProps } from '@/domain/units/entities';

export type UpdateUnitCommand = {
	where: {
		id: string;
	};
	fields?: UnitUpdateProps;
};
