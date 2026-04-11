import type { Section } from '../section.aggregate';
import type { SectionId } from '../value-objects/id.vo';

export interface ISectionRepository {
	load(id: SectionId): Promise<Section | null>;

	save(aggregate: Section): Promise<void>;

	remove(id: SectionId): Promise<boolean>;
}
