import type { Section, SectionQuery } from '@/domain/sections/entities';

export interface ISectionsRepository {
	find(query?: SectionQuery): Promise<Section[]>;

	findOne(id: string): Promise<Section | null>;

	save(entity: Section): Promise<void>;

	remove(id: string): Promise<boolean>;
}
