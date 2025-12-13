import { SortType } from '@pathly-backend/common';
import { SortType as ClientSortType } from '@pathly-backend/contracts/common/types.js';

export function clientSortTypeToDomain(client: ClientSortType): SortType {
	switch (client) {
		case ClientSortType.ASC:
			return SortType.ASC;
		case ClientSortType.DESC:
			return SortType.DESC;
	}
}
