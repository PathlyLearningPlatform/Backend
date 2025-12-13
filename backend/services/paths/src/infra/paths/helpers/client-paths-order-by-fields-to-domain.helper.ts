import { PathsOrderByFields as ClientPathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js';

import { PathsOrderByFields } from '@/domain/paths/enums';

export function clientPathsOrderByFieldsToDomain(
	client: ClientPathsOrderByFields,
): PathsOrderByFields {
	switch (client) {
		case ClientPathsOrderByFields.NAME:
			return PathsOrderByFields.NAME;
		case ClientPathsOrderByFields.CREATED_AT:
			return PathsOrderByFields.CREATED_AT;
		case ClientPathsOrderByFields.UPDATED_AT:
			return PathsOrderByFields.UPDATED_AT;
	}
}
