import type {
	CreateSectionCommand,
	FindOneSectionCommand,
	FindSectionsCommand,
	RemoveSectionCommand,
	UpdateSectionComand,
} from '@/domain/sections/commands';
import { mockedSection, mockedUpdatedSection } from './sections.mock';

export const mockedCreateCommand: CreateSectionCommand = {
	name: mockedSection.name,
	description: mockedSection.description,
	order: mockedSection.order,
	pathId: mockedSection.pathId,
};
export const mockedFindCommand: FindSectionsCommand = {};
export const mockedFindOneCommand: FindOneSectionCommand = {
	where: {
		id: mockedSection.id,
	},
};
export const mockedUpdateCommand: UpdateSectionComand = {
	where: {
		id: mockedSection.id,
	},
	fields: {
		name: mockedUpdatedSection.name,
	},
};
export const mockedRemoveCommand: RemoveSectionCommand = {
	where: {
		id: mockedSection.id,
	},
};
