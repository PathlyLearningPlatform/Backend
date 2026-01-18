import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import type {
	CreateLessonResponse,
	FindLessonsResponse,
	FindOneLessonResponse,
	RemoveLessonResponse,
	UpdateLessonResponse,
} from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import { mockedLesson, mockedUnit } from '@/app/common/mocks';
import type {
	CreateLessonUseCase,
	FindLessonsUseCase,
	FindOneLessonUseCase,
	RemoveLessonUseCase,
	UpdateLessonUseCase,
} from '@/app/lessons/use-cases';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcLessonsController } from '../grpc.controller';
import { mockedClientLesson } from './mocks/lessons.mock';
import {
	mockedCreateUseCase,
	mockedFindOneUseCase,
	mockedFindUseCase,
	mockedRemoveUseCase,
	mockedUpdateUseCase,
	mockedUseCases,
} from './mocks/use-cases.mock';

describe('GrpcLessonsController', () => {
	let lessonsController: GrpcLessonsController;
	let findUseCase: jest.Mocked<FindLessonsUseCase>;
	let findOneUseCase: jest.Mocked<FindOneLessonUseCase>;
	let createUseCase: jest.Mocked<CreateLessonUseCase>;
	let updateUseCase: jest.Mocked<UpdateLessonUseCase>;
	let removeUseCase: jest.Mocked<RemoveLessonUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [GrpcLessonsController],
			providers: [...mockedUseCases],
		}).compile();

		lessonsController = moduleRef.get(GrpcLessonsController);

		findUseCase = moduleRef.get(DiToken.FIND_LESSONS_USE_CASE);
		findOneUseCase = moduleRef.get(DiToken.FIND_ONE_LESSON_USE_CASE);
		createUseCase = moduleRef.get(DiToken.CREATE_LESSON_USE_CASE);
		updateUseCase = moduleRef.get(DiToken.UPDATE_LESSON_USE_CASE);
		removeUseCase = moduleRef.get(DiToken.REMOVE_LESSON_USE_CASE);
	});

	describe('find', () => {
		it('should return FindLessonsResponse', async () => {
			const expectedResult: FindLessonsResponse = {
				lessons: [mockedClientLesson],
			};

			findUseCase.execute.mockResolvedValueOnce([mockedLesson]);

			const result = await lessonsController.find({});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = lessonsController.find({});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOneLessonResponse', async () => {
			const expectedResult: FindOneLessonResponse = {
				lesson: mockedClientLesson,
			};

			findOneUseCase.execute.mockResolvedValueOnce(mockedLesson);

			const result = await lessonsController.findOne({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(
				new LessonNotFoundException('non-existent-lesson-id'),
			);

			const promise = lessonsController.findOne({
				where: { id: 'non-existent-lesson-id' },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = lessonsController.findOne({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('create', () => {
		it('should return CreateLessonResponse', async () => {
			const expectedResult: CreateLessonResponse = {
				lesson: mockedClientLesson,
			};

			createUseCase.execute.mockResolvedValueOnce(mockedLesson);

			const result = await lessonsController.create({
				name: mockedLesson.name,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
				description: null,
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode UNIT_NOT_FOUND', async () => {
			createUseCase.execute.mockRejectedValueOnce(
				new UnitNotFoundException(mockedUnit.id),
			);

			const promise = lessonsController.create({
				name: mockedLesson.name,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
				description: null,
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = lessonsController.create({
				name: mockedLesson.name,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
				description: null,
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('update', () => {
		it('should return UpdateLessonResponse', async () => {
			const expectedResult: UpdateLessonResponse = {
				lesson: mockedClientLesson,
			};

			updateUseCase.execute.mockResolvedValueOnce(mockedLesson);

			const result = await lessonsController.update({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode LESSON_NOT_FOUND', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new LessonNotFoundException('non-existent-lesson-id'),
			);

			const promise = lessonsController.update({
				where: { id: 'non-existent-lesson-id' },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: LearningPathsApiErrorCodes.LESSON_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			updateUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = lessonsController.update({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('remove', () => {
		it('should return RemoveLessonResponse', async () => {
			const expectedResult: RemoveLessonResponse = {
				lesson: mockedClientLesson,
			};

			removeUseCase.execute.mockResolvedValueOnce(mockedLesson);

			const result = await lessonsController.remove({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new LessonNotFoundException('non-existent-lesson-id'),
			);

			const promise = lessonsController.remove({
				where: { id: 'non-existent-lesson-id' },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = lessonsController.remove({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});
});
