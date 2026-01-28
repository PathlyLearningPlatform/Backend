import type { Provider } from '@nestjs/common';
import type {
	CreateLessonUseCase,
	FindLessonsUseCase,
	FindOneLessonUseCase,
	RemoveLessonUseCase,
	UpdateLessonUseCase,
} from '@/app/lessons/use-cases';
import { DiToken } from '@/infra/common/enums';

export const mockedFindUseCase: jest.Mocked<Partial<FindLessonsUseCase>> = {
	execute: jest.fn(),
};

export const mockedFindOneUseCase: jest.Mocked<Partial<FindOneLessonUseCase>> =
	{
		execute: jest.fn(),
	};

export const mockedCreateUseCase: jest.Mocked<Partial<CreateLessonUseCase>> = {
	execute: jest.fn(),
};

export const mockedUpdateUseCase: jest.Mocked<Partial<UpdateLessonUseCase>> = {
	execute: jest.fn(),
};

export const mockedRemoveUseCase: jest.Mocked<Partial<RemoveLessonUseCase>> = {
	execute: jest.fn(),
};

export const mockedUseCases: Provider[] = [
	{
		provide: DiToken.FIND_LESSONS_USE_CASE,
		useValue: mockedFindUseCase,
	},
	{
		provide: DiToken.FIND_ONE_LESSON_USE_CASE,
		useValue: mockedFindOneUseCase,
	},
	{
		provide: DiToken.CREATE_LESSON_USE_CASE,
		useValue: mockedCreateUseCase,
	},
	{
		provide: DiToken.UPDATE_LESSON_USE_CASE,
		useValue: mockedUpdateUseCase,
	},
	{
		provide: DiToken.REMOVE_LESSON_USE_CASE,
		useValue: mockedRemoveUseCase,
	},
];
