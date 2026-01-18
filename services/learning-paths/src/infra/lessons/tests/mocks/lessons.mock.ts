import { nullToEmptyString } from '@pathly-backend/common/index.js';
import type { Lesson as ClientLesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import { mockedLesson } from '@/app/common/mocks';
import type { DbLesson } from '../../types';

export const mockedDbLesson: DbLesson = {
	...mockedLesson,
	createdAt: new Date(mockedLesson.createdAt),
	updatedAt: new Date(mockedLesson.updatedAt),
};

export const mockedClientLesson: ClientLesson = {
	...mockedLesson,
	description: nullToEmptyString(mockedLesson.description),
};
