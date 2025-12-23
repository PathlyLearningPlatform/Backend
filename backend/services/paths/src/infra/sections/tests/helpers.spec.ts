import { dbSectionToEntity, sectionEntityToClient } from '../helpers';
import { mockedClientSection, mockedDbSection } from './mocks/sections.mock';
import { mockedSection } from '@/app/common/mocks';

describe('helpers', () => {
	describe('dbSectionToEntity', () => {
		it('should return domain section entity', () => {
			const result = dbSectionToEntity(mockedDbSection);

			expect(result).toEqual(mockedSection);
		});
	});

	describe('sectionEntityToClient', () => {
		it('should return client section', () => {
			const result = sectionEntityToClient(mockedSection);

			expect(result).toEqual(mockedClientSection);
		});
	});
});
