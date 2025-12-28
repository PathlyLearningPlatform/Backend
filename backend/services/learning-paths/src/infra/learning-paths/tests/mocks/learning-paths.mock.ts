import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type { DbLearningPath } from '../../types';
import { nullToEmptyString } from '@pathly-backend/common/index.js';
import { mockedLearningPath } from '@/app/common/mocks';

export const mockedDbLearningPath: DbLearningPath = {
	...mockedLearningPath,
	createdAt: new Date(mockedLearningPath.createdAt),
	updatedAt: new Date(mockedLearningPath.updatedAt),
};

export const mockedClientLearningPath: ClientLearningPath = {
	...mockedLearningPath,
	description: nullToEmptyString(mockedLearningPath.description),
};
