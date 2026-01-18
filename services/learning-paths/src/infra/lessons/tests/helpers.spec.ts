import { mockedLesson } from '@/app/common/mocks';
import { dbLessonToEntity, lessonEntityToClient } from '../helpers';
import { mockedClientLesson, mockedDbLesson } from './mocks/lessons.mock';

describe('helpers', () => {
	describe('dbLessonToEntity', () => {
		it('should return domain lesson entity', () => {
			const result = dbLessonToEntity(mockedDbLesson);

			expect(result).toEqual(mockedLesson);
		});
	});

	describe('lessonEntityToClient', () => {
		it('should return client lesson', () => {
			const result = lessonEntityToClient(mockedLesson);

			expect(result).toEqual(mockedClientLesson);
		});
	});
});
