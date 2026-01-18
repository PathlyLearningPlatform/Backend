import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import type {
	CreateUnitResponse,
	FindOneUnitResponse,
	FindUnitsResponse,
	RemoveUnitResponse,
	UpdateUnitResponse,
} from '@pathly-backend/contracts/learning-paths/v1/units.js';
import { mockedSection, mockedUnit } from '@/app/common/mocks';
import type {
	CreateUnitUseCase,
	FindOneUnitUseCase,
	FindUnitsUseCase,
	RemoveUnitUseCase,
	UpdateUnitUseCase,
} from '@/app/units/use-cases';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcUnitsController } from '../grpc.controller';
import { mockedClientUnit } from './mocks/units.mock';
import {
	mockedCreateUseCase,
	mockedFindOneUseCase,
	mockedFindUseCase,
	mockedRemoveUseCase,
	mockedUpdateUseCase,
	mockedUseCases,
} from './mocks/use-cases.mock';

describe('GrpcUnitsController', () => {
	let unitsController: GrpcUnitsController;
	let findUseCase: jest.Mocked<FindUnitsUseCase>;
	let findOneUseCase: jest.Mocked<FindOneUnitUseCase>;
	let createUseCase: jest.Mocked<CreateUnitUseCase>;
	let updateUseCase: jest.Mocked<UpdateUnitUseCase>;
	let removeUseCase: jest.Mocked<RemoveUnitUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [GrpcUnitsController],
			providers: [...mockedUseCases],
		}).compile();

		unitsController = moduleRef.get(GrpcUnitsController);

		findUseCase = moduleRef.get(DiToken.FIND_UNITS_USE_CASE);
		findOneUseCase = moduleRef.get(DiToken.FIND_ONE_UNIT_USE_CASE);
		createUseCase = moduleRef.get(DiToken.CREATE_UNIT_USE_CASE);
		updateUseCase = moduleRef.get(DiToken.UPDATE_UNIT_USE_CASE);
		removeUseCase = moduleRef.get(DiToken.REMOVE_UNIT_USE_CASE);
	});

	describe('find', () => {
		it('should return FindUnitsResponse', async () => {
			const expectedResult: FindUnitsResponse = {
				units: [mockedClientUnit],
			};

			findUseCase.execute.mockResolvedValueOnce([mockedUnit]);

			const result = await unitsController.find({});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = unitsController.find({});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOneUnitResponse', async () => {
			const expectedResult: FindOneUnitResponse = {
				unit: mockedClientUnit,
			};

			findOneUseCase.execute.mockResolvedValueOnce(mockedUnit);

			const result = await unitsController.findOne({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(
				new UnitNotFoundException('non-existent-unit-id'),
			);

			const promise = unitsController.findOne({
				where: { id: 'non-existent-unit-id' },
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

			const promise = unitsController.findOne({
				where: { id: mockedUnit.id },
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
		it('should return CreateUnitResponse', async () => {
			const expectedResult: CreateUnitResponse = {
				unit: mockedClientUnit,
			};

			createUseCase.execute.mockResolvedValueOnce(mockedUnit);

			const result = await unitsController.create({
				name: mockedUnit.name,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
				description: null,
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode SECTION_NOT_FOUND', async () => {
			createUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException(mockedSection.id),
			);

			const promise = unitsController.create({
				name: mockedUnit.name,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
				description: null,
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = unitsController.create({
				name: mockedUnit.name,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
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
		it('should return UpdateUnitResponse', async () => {
			const expectedResult: UpdateUnitResponse = {
				unit: mockedClientUnit,
			};

			updateUseCase.execute.mockResolvedValueOnce(mockedUnit);

			const result = await unitsController.update({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode UNIT_NOT_FOUND', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new UnitNotFoundException('non-existent-unit-id'),
			);

			const promise = unitsController.update({
				where: { id: 'non-existent-unit-id' },
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
			updateUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = unitsController.update({
				where: { id: mockedUnit.id },
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
		it('should return RemoveUnitResponse', async () => {
			const expectedResult: RemoveUnitResponse = {
				unit: mockedClientUnit,
			};

			removeUseCase.execute.mockResolvedValueOnce(mockedUnit);

			const result = await unitsController.remove({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new UnitNotFoundException('non-existent-unit-id'),
			);

			const promise = unitsController.remove({
				where: { id: 'non-existent-unit-id' },
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

			const promise = unitsController.remove({
				where: { id: mockedUnit.id },
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
