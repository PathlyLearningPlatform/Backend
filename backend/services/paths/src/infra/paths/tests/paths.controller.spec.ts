import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import {
	AppLogger,
	AppLoggerModule,
	GrpcErrorDto,
	GrpcException,
} from '@pathly-backend/common/index.js';
import type {
	FindOnePathResponse,
	FindPathsResponse,
} from '@pathly-backend/contracts/paths/v1/paths.js';
import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import { DiToken } from '@/infra/common/enums';
import { PathsController } from '../paths.controller';
import { mockedPath } from './mocks/paths.mock';
import { mockedFindOnePayload, mockedFindPayload } from './mocks/payloads.mock';
import { mockedFindUseCase } from './mocks/use-cases.mock';

describe('PathsController', () => {
	let pathsController: PathsController;
	let findUseCase: jest.Mocked<FindPathsUseCase>;
	let findOneUseCase: jest.Mocked<FindOnePathUseCase>;
	let createUseCase: jest.Mocked<CreatePathUseCase>;
	let updateUseCase: jest.Mocked<UpdatePathUseCase>;
	let removeUseCase: jest.Mocked<RemovePathUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [PathsController],
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

		pathsController = moduleRef.get(PathsController);

		findUseCase = moduleRef.get(DiToken.FIND_PATHS_USE_CASE);
		findOneUseCase = moduleRef.get(DiToken.FIND_ONE_PATH_USE_CASE);
		createUseCase = moduleRef.get(DiToken.CREATE_PATH_USE_CASE);
		updateUseCase = moduleRef.get(DiToken.UPDATE_PATH_USE_CASE);
		removeUseCase = moduleRef.get(DiToken.REMOVE_PATH_USE_CASE);
	});

	describe('find', () => {
		it('should return FindPathsResponse', async () => {
			const expectedResult: FindPathsResponse = {
				paths: [mockedPath],
			};

			findUseCase.execute.mockResolvedValueOnce([mockedPath]);

			const result = await pathsController.find(mockedFindPayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = pathsController.find(mockedFindPayload);

			await expect(promise).rejects.toMatchObject({
				constructor: GrpcException,
				error: new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOnePathResponse', async () => {
			const expectedResult: FindOnePathResponse = {
				path: mockedPath,
			};

			findOneUseCase.execute.mockResolvedValueOnce(mockedPath);

			const result = await pathsController.findOne(mockedFindOnePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {});

		it('should throw GrpcException with INTERNAL status', async () => {});
	});

	describe('create', () => {
		it('should return CreatePathResponse', async () => {});

		it('should throw GrpcException with INTERNAL status', async () => {});
	});

	describe('update', () => {
		it('should return UpdatePathResponse', async () => {});

		it('should throw GrpcException with NOT_FOUND status', async () => {});

		it('should throw GrpcException with INTERNAL status', async () => {});
	});

	describe('remove', () => {
		it('should return RemovePathResponse', async () => {});

		it('should throw GrpcException with NOT_FOUND status', async () => {});

		it('should throw GrpcException with INTERNAL status', async () => {});
	});
});
