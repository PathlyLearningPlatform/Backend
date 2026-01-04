import { nullToEmptyString } from '@pathly-backend/common';
import type { Unit as ClientUnit } from '@pathly-backend/contracts/learning-paths/v1/units.js';
import type { Unit } from '@/domain/units/entities';

export function unitEntityToClient(entity: Unit): ClientUnit {
	return { ...entity, description: nullToEmptyString(entity.description) };
}
