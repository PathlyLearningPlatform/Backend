import type { SectionUpdateFields } from '@/domain/sections/entities';

export type UpdateSectionCommand = {
	where: {
		id: string;
	};
	fields?: SectionUpdateFields;
};
