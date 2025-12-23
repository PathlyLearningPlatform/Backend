import {
	clientPathsOrderByFieldsToDomain,
	dbPathToEntity,
	pathEntityToClient,
} from '../helpers';
import { mockedClientPath, mockedDbPath } from './mocks/paths.mock';
import { PathsOrderByFields as ClientPathsOrderByFields } from '@pathly-backend/contracts/paths/v1/paths.js';
import { PathsOrderByFields } from '@/domain/paths/enums';
import { mockedPath } from '@/app/common/mocks';

describe('helpers', () => {
	describe('dbPathToEntity', () => {
		it('should return domain path entity', () => {
			const result = dbPathToEntity(mockedDbPath);

			expect(result).toEqual(mockedPath);
		});
	});
	describe('clientPathsOrderByFieldsToDomain', () => {
		it('should return domain PathsOrderByFields.NAME', () => {
			const name = clientPathsOrderByFieldsToDomain(
				ClientPathsOrderByFields.NAME,
			);

			expect(name).toBe(PathsOrderByFields.NAME);
		});

		it('should return domain PathsOrderByFields.CREATED_AT', () => {
			const createdAt = clientPathsOrderByFieldsToDomain(
				ClientPathsOrderByFields.CREATED_AT,
			);

			expect(createdAt).toBe(PathsOrderByFields.CREATED_AT);
		});

		it('should return domain PathsOrderByFields.UPDATED_AT', () => {
			const updatedAt = clientPathsOrderByFieldsToDomain(
				ClientPathsOrderByFields.UPDATED_AT,
			);

			expect(updatedAt).toBe(PathsOrderByFields.UPDATED_AT);
		});
	});
	describe('pathEntityToClient', () => {
		it('should return client path', () => {
			const result = pathEntityToClient(mockedPath);

			expect(result).toEqual(mockedClientPath);
		});
	});
});
