import { nullToEmptyString } from '@pathly-backend/common';
import type { Path as ClientPath } from '@pathly-backend/contracts/paths/v1/paths.js';
import type { Path } from '@/domain/paths/entities';

export function pathEntityToClient(entity: Path): ClientPath {
	return { ...entity, description: nullToEmptyString(entity.description) };
}
