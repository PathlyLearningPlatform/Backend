import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import type {
	FindOneLearningPathResponse,
	FindLearningPathsResponse,
	CreateLearningPathResponse,
	UpdateLearningPathResponse,
	RemoveLearningPathResponse,
} from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type {
	CreateLearningPathUseCase,
	FindOneLearningPathUseCase,
	FindLearningPathsUseCase,
	RemoveLearningPathUseCase,
	UpdateLearningPathUseCase,
} from '@/app/learning-paths/use-cases';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcLearningPathsController } from '../grpc.controller';
import { mockedClientLearningPath } from './mocks/learning-paths.mock';
import { mockedFindLearningPathsUseCase, mockedUseCases } from './mocks/use-cases.mock';
import { mockedLearningPath } from '@/app/common/mocks';

describe('GrpcLearningPathsController', () => {
	let learningPathsController: GrpcLearningPathsController;
	let findLearningPathsUseCase: jest.Mocked<FindLearningPathsUseCase>;
	let findOneLearningPathUseCase: jest.Mocked<FindOneLearningPathUseCase>;
	let createLearningPathUseCase: jest.Mocked<CreateLearningPathUseCase>;
	let updateLearningPathUseCase: jest.Mocked<UpdateLearningPathUseCase>;
	let removeLearningPathUseCase: jest.Mocked<RemoveLearningPathUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [GrpcLearningPathsController],
			providers: [...mockedUseCases],
		}).compile();

		learningPathsController = moduleRef.get(GrpcLearningPathsController);

		findLearningPathsUseCase = moduleRef.get(DiToken.FIND_LEARNING_PATHS_USE_CASE);
		findOneLearningPathUseCase = moduleRef.get(DiToken.FIND_ONE_LEARNING_PATH_USE_CASE);
		createLearningPathUseCase = moduleRef.get(DiToken.CREATE_LEARNING_PATH_USE_CASE);
		updateLearningPathUseCase = moduleRef.get(DiToken.UPDATE_LEARNING_PATH_USE_CASE);
		removeLearningPathUseCase = moduleRef.get(DiToken.REMOVE_LEARNING_PATH_USE_CASE);
	});

	describe('find', () => {
		it('should return FindLearningPathsResponse', async () => {
			const expectedResult: FindLearningPathsResponse = {
				learningPaths: [mockedClientLearningPath],
			};

			findLearningPathsUseCase.execute.mockResolvedValueOnce([mockedLearningPath]);

			const result = await learningPathsController.find({});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findLearningPathsUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = learningPathsController.find({});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOneLearningPathResponse', async () => {
			const expectedResult: FindOneLearningPathResponse = {
				learningPath: mockedClientLearningPath,
			};

			findOneLearningPathUseCase.execute.mockResolvedValueOnce(mockedLearningPath);

			const result = await learningPathsController.findOne({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneLearningPathUseCase.execute.mockRejectedValueOnce(
				new LearningPathNotFoundException(mockedLearningPath.id),
			);

			const promise = learningPathsController.findOne({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findOneLearningPathUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = learningPathsController.findOne({
				where: { id: mockedLearningPath.id },
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
		it('should return CreateLearningPathResponse', async () => {
			const expectedResult: CreateLearningPathResponse = {
				learningPath: mockedClientLearningPath,
			};

			createLearningPathUseCase.execute.mockResolvedValueOnce(mockedLearningPath);

			const result = await learningPathsController.create({
				name: mockedLearningPath.name,
				description: null,
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createLearningPathUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = learningPathsController.create({
				name: mockedLearningPath.name,
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
		it('should return UpdateLearningPathResponse', async () => {
			const expectedResult: UpdateLearningPathResponse = {
				learningPath: mockedClientLearningPath,
			};

			updateLearningPathUseCase.execute.mockResolvedValueOnce(mockedLearningPath);

			const result = await learningPathsController.update({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			updateLearningPathUseCase.execute.mockRejectedValueOnce(
				new LearningPathNotFoundException('non-existent-learning-path-id'),
			);

			const promise = learningPathsController.update({
				where: { id: 'non-existent-learning-path-id' },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			updateLearningPathUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = learningPathsController.update({
				where: { id: mockedLearningPath.id },
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
		it('should return RemoveLearningPathResponse', async () => {
			const expectedResult: RemoveLearningPathResponse = {
				learningPath: mockedClientLearningPath,
			};

			removeLearningPathUseCase.execute.mockResolvedValueOnce(mockedLearningPath);

			const result = await learningPathsController.remove({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeLearningPathUseCase.execute.mockRejectedValueOnce(
				new LearningPathNotFoundException('non-existent-learning-path-id'),
			);

			const promise = learningPathsController.remove({
				where: { id: 'non-existent-learning-path-id' },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with FAILED_PRECONDITION status', async () => {
			removeLearningPathUseCase.execute.mockRejectedValueOnce(
				new LearningPathCannotBeRemovedException(mockedLearningPath.id),
			);

			const promise = learningPathsController.remove({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.FAILED_PRECONDITION,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			removeLearningPathUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = learningPathsController.remove({
				where: { id: mockedLearningPath.id },
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
