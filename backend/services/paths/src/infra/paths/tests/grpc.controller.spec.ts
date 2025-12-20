import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import type {
	FindOnePathResponse,
	FindPathsResponse,
	CreatePathResponse,
	UpdatePathResponse,
	RemovePathResponse,
} from '@pathly-backend/contracts/paths/v1/paths.js';
import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import {
	mockedFindOneCommand,
	mockedRemoveCommand,
	mockedUpdateCommand,
} from '@/app/paths/tests/mocks/commands.mock';
import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from '@/domain/paths/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcPathsController } from '../grpc.controller';
import { mockedClientPath, mockedPath } from './mocks/paths.mock';
import { mockedFindOnePayload, mockedFindPayload } from './mocks/payloads.mock';
import { mockedFindUseCase } from './mocks/use-cases.mock';

describe('GrpcPathsController', () => {
	let pathsController: GrpcPathsController;
	let findUseCase: jest.Mocked<FindPathsUseCase>;
	let findOneUseCase: jest.Mocked<FindOnePathUseCase>;
	let createUseCase: jest.Mocked<CreatePathUseCase>;
	let updateUseCase: jest.Mocked<UpdatePathUseCase>;
	let removeUseCase: jest.Mocked<RemovePathUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [GrpcPathsController],
			providers: [
				{
					provide: DiToken.FIND_PATHS_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.FIND_ONE_PATH_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.CREATE_PATH_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.UPDATE_PATH_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.REMOVE_PATH_USE_CASE,
					useValue: mockedFindUseCase,
				},
			],
		}).compile();

		pathsController = moduleRef.get(GrpcPathsController);

		findUseCase = moduleRef.get(DiToken.FIND_PATHS_USE_CASE);
		findOneUseCase = moduleRef.get(DiToken.FIND_ONE_PATH_USE_CASE);
		createUseCase = moduleRef.get(DiToken.CREATE_PATH_USE_CASE);
		updateUseCase = moduleRef.get(DiToken.UPDATE_PATH_USE_CASE);
		removeUseCase = moduleRef.get(DiToken.REMOVE_PATH_USE_CASE);
	});

	describe('find', () => {
		it('should return FindPathsResponse', async () => {
			const expectedResult: FindPathsResponse = {
				paths: [mockedClientPath],
			};

			findUseCase.execute.mockResolvedValueOnce([mockedPath]);

			const result = await pathsController.find(mockedFindPayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.find(mockedFindPayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOnePathResponse', async () => {
			const expectedResult: FindOnePathResponse = {
				path: mockedClientPath,
			};

			findOneUseCase.execute.mockResolvedValueOnce(mockedPath);

			const result = await pathsController.findOne(mockedFindOnePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(
				new PathNotFoundException(mockedPath.id),
			);

			const promise = pathsController.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('create', () => {
		it('should return CreatePathResponse', async () => {
			const expectedResult: CreatePathResponse = {
				path: mockedClientPath,
			};

			createUseCase.execute.mockResolvedValueOnce(mockedPath);

			const result = await pathsController.create({
				description: mockedPath.description,
				name: mockedPath.name,
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.create({
				description: mockedPath.description,
				name: mockedPath.name,
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
		it('should return UpdatePathResponse', async () => {
			const expectedResult: UpdatePathResponse = {
				path: mockedClientPath,
			};

			updateUseCase.execute.mockResolvedValueOnce(mockedPath);

			const result = await pathsController.update(mockedUpdateCommand);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new PathNotFoundException(mockedPath.id),
			);

			const promise = pathsController.update(mockedUpdateCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			updateUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.update(mockedUpdateCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('remove', () => {
		it('should return RemovePathResponse', async () => {
			const expectedResult: RemovePathResponse = {
				path: mockedClientPath,
			};

			removeUseCase.execute.mockResolvedValueOnce(mockedPath);

			const result = await pathsController.remove(mockedRemoveCommand);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new PathNotFoundException(mockedPath.id),
			);

			const promise = pathsController.remove(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with FAILED_PRECONDITION status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new PathCannotBeRemovedException(mockedPath.id),
			);

			const promise = pathsController.remove(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.FAILED_PRECONDITION,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.remove(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});
});
