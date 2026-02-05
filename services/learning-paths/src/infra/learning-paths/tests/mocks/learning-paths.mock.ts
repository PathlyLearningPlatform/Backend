import { nullToEmptyString } from '@pathly-backend/common/index.js';
import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import { mockedLearningPath } from '@/app/common/mocks';
import type { DbLearningPath } from '../../types';

export const mockedDbLearningPath: DbLearningPath = mockedLearningPath;

export const mockedClientLearningPath: ClientLearningPath = {
	...mockedLearningPath,
	description: nullToEmptyString(mockedLearningPath.description),
	updatedAt:
		mockedLearningPath.updatedAt === null
			? ''
			: mockedLearningPath.updatedAt.toISOString(),
	createdAt: mockedLearningPath.createdAt.toISOString(),
};
