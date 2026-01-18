import {
	mockedLesson,
	mockedLessonsRepository,
	mockedUnit,
	mockedUnitsRepository,
} from '@/app/common/mocks';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { CreateLessonUseCase } from '../create.use-case';

describe('CreateLessonUseCase', () => {
	let createLessonUseCase: CreateLessonUseCase;

	beforeEach(() => {
		createLessonUseCase = new CreateLessonUseCase(
			mockedLessonsRepository,
			mockedUnitsRepository,
		);
	});

	describe('execute', () => {
		it('should return a lesson', async () => {
			mockedUnitsRepository.findOne.mockResolvedValueOnce(mockedUnit);

			mockedLessonsRepository.create.mockResolvedValueOnce(mockedLesson);

			const result = await createLessonUseCase.execute({
				name: mockedLesson.name,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
				description: mockedLesson.description,
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should throw UnitNotFoundException if unit not found', async () => {
			mockedUnitsRepository.findOne.mockResolvedValueOnce(null);

			await expect(
				createLessonUseCase.execute({
					name: mockedLesson.name,
					order: mockedLesson.order,
					unitId: mockedLesson.unitId,
					description: mockedLesson.description,
				}),
			).rejects.toThrow(UnitNotFoundException);
		});
	});
});
