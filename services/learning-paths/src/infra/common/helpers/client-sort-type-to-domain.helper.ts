import { SortType } from '@pathly-backend/common';
import { SortType as ClientSortType } from '@pathly-backend/contracts/common/types.js';

/**
 * @param client client sort type
 * @returns domain sort type
 * @description This helper function's purpose is to convert SortType from contracts library to SortType from common library.
 */
export function clientSortTypeToDomain(client: ClientSortType): SortType {
	switch (client) {
		case ClientSortType.ASC:
			return SortType.ASC;
		case ClientSortType.DESC:
			return SortType.DESC;
	}
}
