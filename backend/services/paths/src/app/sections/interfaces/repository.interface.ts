import type {
	CreateSectionCommand,
	FindOneSectionCommand,
	FindSectionsCommand,
	RemoveSectionCommand,
	UpdateSectionCommand,
} from '@/app/sections/commands';
import type { Section } from '@/domain/sections/entities';

/**
 * This interface represents a class which task is to retrieve or add sections from / to a data source. It only tells what data is needed and what data is returned (it is datasource agnostic). Concrete path repositories should implement this interface.
 */
export interface ISectionsRepository {
	find(command: FindSectionsCommand): Promise<Section[]>;
	findOne(command: FindOneSectionCommand): Promise<Section | null>;
	create(command: CreateSectionCommand): Promise<Section>;
	update(command: UpdateSectionCommand): Promise<Section | null>;
	remove(command: RemoveSectionCommand): Promise<Section | null>;
}
