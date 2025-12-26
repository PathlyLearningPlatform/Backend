import { PathsOrderByFields as ClientPathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js'
import { PathsOrderByFields } from '@/domain/paths/enums'

export function domainPathsOrderByFieldsToClient(
	domain: PathsOrderByFields,
): ClientPathsOrderByFields {
	switch (domain) {
		case PathsOrderByFields.NAME:
			return ClientPathsOrderByFields.NAME
		case PathsOrderByFields.CREATED_AT:
			return ClientPathsOrderByFields.CREATED_AT
		case PathsOrderByFields.UPDATED_AT:
			return ClientPathsOrderByFields.UPDATED_AT
	}
}
