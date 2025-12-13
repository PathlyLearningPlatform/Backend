import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathComand,
} from '@/domain/paths/commands';
import { mockedPath, mockedUpdatedPath } from './paths.mock';

export const mockedCreateCommand: CreatePathCommand = {
	name: mockedPath.name,
	description: mockedPath.description,
};
export const mockedFindCommand: FindPathsCommand = {};
export const mockedFindOneCommand: FindOnePathCommand = {
	where: {
		id: mockedPath.id,
	},
};
export const mockedUpdateCommand: UpdatePathComand = {
	where: {
		id: mockedPath.id,
	},
	fields: {
		name: mockedUpdatedPath.name,
	},
};
export const mockedRemoveCommand: RemovePathCommand = {
	where: {
		id: mockedPath.id,
	},
};
