import { mockedUnit } from '@/app/common/mocks';
import { dbUnitToEntity, unitEntityToClient } from '../helpers';
import { mockedClientUnit, mockedDbUnit } from './mocks/units.mock';

describe('helpers', () => {
	describe('dbUnitToEntity', () => {
		it('should return domain unit entity', () => {
			const result = dbUnitToEntity(mockedDbUnit);

			expect(result).toEqual(mockedUnit);
		});
	});

	describe('unitEntityToClient', () => {
		it('should return client unit', () => {
			const result = unitEntityToClient(mockedUnit);

			expect(result).toEqual(mockedClientUnit);
		});
	});
});
