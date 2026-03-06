import { DomainEvent } from '@/domain/common';
import { Section } from '../section.aggregate';
import { SectionId } from '../value-objects/id.vo';

export interface ISectionRepository {
	load(id: SectionId): Promise<Section | null>;

	save(aggregate: Section): Promise<void>;

	remove(id: SectionId): Promise<boolean>;
}
