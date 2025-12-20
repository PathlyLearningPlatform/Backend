import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import type {
	FindOneSectionResponse,
	FindSectionsResponse,
	CreateSectionResponse,
	UpdateSectionResponse,
	RemoveSectionResponse,
} from '@pathly-backend/contracts/paths/v1/sections.js';
import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import {
	mockedCreateCommand,
	mockedFindOneCommand,
	mockedRemoveCommand,
	mockedUpdateCommand,
} from '@/app/sections/tests/mocks/commands.mock';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcSectionsController } from '../grpc.controller';
import { mockedClientSection, mockedSection } from './mocks/sections.mock';
import {
	mockedCreatePayload,
	mockedFindOnePayload,
	mockedFindPayload,
	mockedRemovePayload,
	mockedUpdatePayload,
} from './mocks/payloads.mock';
import { mockedFindUseCase } from './mocks/use-cases.mock';
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import { mockedPath } from '@/app/paths/tests/mocks/paths.mock';

describe('GrpcSectionsController', () => {
	let sectionsController: GrpcSectionsController;
	let findUseCase: jest.Mocked<FindSectionsUseCase>;
	let findOneUseCase: jest.Mocked<FindOneSectionUseCase>;
	let createUseCase: jest.Mocked<CreateSectionUseCase>;
	let updateUseCase: jest.Mocked<UpdateSectionUseCase>;
	let removeUseCase: jest.Mocked<RemoveSectionUseCase>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppLoggerModule],
			controllers: [GrpcSectionsController],
			providers: [
				{
					provide: DiToken.FIND_SECTIONS_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.FIND_ONE_SECTION_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.CREATE_SECTION_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.UPDATE_SECTION_USE_CASE,
					useValue: mockedFindUseCase,
				},
				{
					provide: DiToken.REMOVE_SECTION_USE_CASE,
					useValue: mockedFindUseCase,
				},
			],
		}).compile();

		sectionsController = moduleRef.get(GrpcSectionsController);

		findUseCase = moduleRef.get(DiToken.FIND_SECTIONS_USE_CASE);
		findOneUseCase = moduleRef.get(DiToken.FIND_ONE_SECTION_USE_CASE);
		createUseCase = moduleRef.get(DiToken.CREATE_SECTION_USE_CASE);
		updateUseCase = moduleRef.get(DiToken.UPDATE_SECTION_USE_CASE);
		removeUseCase = moduleRef.get(DiToken.REMOVE_SECTION_USE_CASE);
	});

	describe('find', () => {
		it('should return FindSectionsResponse', async () => {
			const expectedResult: FindSectionsResponse = {
				sections: [mockedClientSection],
			};

			findUseCase.execute.mockResolvedValueOnce([mockedSection]);

			const result = await sectionsController.find(mockedFindPayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.find(mockedFindPayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('findOne', () => {
		it('should return FindOneSectionResponse', async () => {
			const expectedResult: FindOneSectionResponse = {
				section: mockedClientSection,
			};

			findOneUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.findOne(mockedFindOnePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException(mockedSection.id),
			);

			const promise = sectionsController.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('create', () => {
		it('should return CreateSectionResponse', async () => {
			const expectedResult: CreateSectionResponse = {
				section: mockedClientSection,
			};

			createUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.create(mockedCreatePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode PATH_NOT_FOUND', async () => {
			createUseCase.execute.mockRejectedValueOnce(
				new PathNotFoundException(mockedPath.id),
			);

			const promise = sectionsController.create(mockedCreatePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: PathsApiErrorCodes.PATH_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.create(mockedCreatePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('update', () => {
		it('should return UpdateSectionResponse', async () => {
			const expectedResult: UpdateSectionResponse = {
				section: mockedClientSection,
			};

			updateUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.update(mockedUpdatePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode PATH_NOT_FOUND', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new PathNotFoundException(mockedPath.id),
			);

			const promise = sectionsController.update(mockedUpdatePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: PathsApiErrorCodes.PATH_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode SECTION_NOT_FOUND', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException(mockedSection.id),
			);

			const promise = sectionsController.update(mockedUpdatePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: PathsApiErrorCodes.SECTION_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			updateUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.update(mockedUpdatePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});

	describe('remove', () => {
		it('should return RemoveSectionResponse', async () => {
			const expectedResult: RemoveSectionResponse = {
				section: mockedClientSection,
			};

			removeUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.remove(mockedRemovePayload);

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException(mockedSection.id),
			);

			const promise = sectionsController.remove(mockedRemovePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.remove(mockedRemovePayload);

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.INTERNAL,
				},
			});
		});
	});
});
