import { nullToEmptyString } from '@pathly-backend/common';
import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type { Section } from '@/domain/sections/entities';

export function sectionEntityToClient(entity: Section): ClientSection {
	return { ...entity, description: nullToEmptyString(entity.description) };
}
