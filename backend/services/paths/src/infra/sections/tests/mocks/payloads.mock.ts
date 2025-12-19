import type z from 'zod';
import type {
	createSectionSchema,
	findOneSectionSchema,
	findSectionsSchema,
	removeSectionSchema,
	updateSectionSchema,
} from '../../schemas';
import { mockedSection } from './sections.mock';

export const mockedFindPayload: z.infer<typeof findSectionsSchema> = {};
export const mockedFindOnePayload: z.infer<typeof findOneSectionSchema> = {
	where: {
		id: mockedSection.id,
	},
};
export const mockedCreatePayload: z.infer<typeof createSectionSchema> = {
	description: mockedSection.description,
	name: mockedSection.name,
	order: mockedSection.order,
	pathId: mockedSection.pathId,
};
export const mockedUpdatePayload: z.infer<typeof updateSectionSchema> = {
	where: {
		id: mockedSection.id,
	},
};
export const mockedRemovePayload: z.infer<typeof removeSectionSchema> = {
	where: {
		id: mockedSection.id,
	},
};
