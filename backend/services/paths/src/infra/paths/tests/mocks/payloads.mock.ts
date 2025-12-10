import z from 'zod';
import {
	createPathSchema,
	findOnePathSchema,
	findPathsSchema,
	removePathSchema,
	updatePathSchema,
} from '../../schemas';
import { mockedPath } from './paths.mock';

export const mockedFindPayload: z.infer<typeof findPathsSchema> = {};
export const mockedFindOnePayload: z.infer<typeof findOnePathSchema> = {
	where: {
		id: mockedPath.id,
	},
};
export const mockedCreatePayload: z.infer<typeof createPathSchema> = {
	description: mockedPath.description,
	name: mockedPath.name,
};
export const mockedUpdatePayload: z.infer<typeof updatePathSchema> = {
	where: {
		id: mockedPath.id,
	},
};
export const mockedRemovePayload: z.infer<typeof removePathSchema> = {
	where: {
		id: mockedPath.id,
	},
};
