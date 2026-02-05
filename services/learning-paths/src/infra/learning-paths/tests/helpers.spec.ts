import { LearningPathsOrderByFields as ClientLearningPathsOrderByFields } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import { mockedLearningPath } from '@/app/common/mocks';
import { LearningPathsOrderByFields } from '@/domain/learning-paths/enums';
import {
	clientLearningPathsOrderByFieldsToDomain,
	dbLearningPathToEntity,
	learningPathEntityToClient,
} from '../helpers';
import {
	mockedClientLearningPath,
	mockedDbLearningPath,
} from './mocks/learning-paths.mock';

describe('helpers', () => {
	describe('dbPathToEntity', () => {
		it('should return domain path entity', () => {
			const result = dbLearningPathToEntity(mockedDbLearningPath);

			expect(result).toEqual(mockedLearningPath);
		});
	});
	describe('clientPathsOrderByFieldsToDomain', () => {
		it('should return domain PathsOrderByFields.NAME', () => {
			const name = clientLearningPathsOrderByFieldsToDomain(
				ClientLearningPathsOrderByFields.NAME,
			);

			expect(name).toBe(LearningPathsOrderByFields.NAME);
		});

		it('should return domain PathsOrderByFields.CREATED_AT', () => {
			const createdAt = clientLearningPathsOrderByFieldsToDomain(
				ClientLearningPathsOrderByFields.CREATED_AT,
			);

			expect(createdAt).toBe(LearningPathsOrderByFields.CREATED_AT);
		});

		it('should return domain PathsOrderByFields.UPDATED_AT', () => {
			const updatedAt = clientLearningPathsOrderByFieldsToDomain(
				ClientLearningPathsOrderByFields.UPDATED_AT,
			);

			expect(updatedAt).toBe(LearningPathsOrderByFields.UPDATED_AT);
		});
	});
	describe('pathEntityToClient', () => {
		it('should return client path', () => {
			const result = learningPathEntityToClient(mockedLearningPath);

			expect(result).toEqual(mockedClientLearningPath);
		});
	});
});
