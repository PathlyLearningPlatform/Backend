import { SortType as ClientSortType } from '@pathly-backend/contracts/common/types.js'
import { SortType } from '@pathly-backend/common'

export function domainSortTypeToClient(domain: SortType): ClientSortType {
	switch (domain) {
		case SortType.ASC:
			return ClientSortType.ASC
		case SortType.DESC:
			return ClientSortType.DESC
	}
}
