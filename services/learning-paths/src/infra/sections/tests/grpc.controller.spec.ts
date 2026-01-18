import { status as GrpcStatus } from '@grpc/grpc-js';
import { Test } from '@nestjs/testing';
import { AppLoggerModule } from '@pathly-backend/common/index.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import type {
	CreateSectionResponse,
	FindOneSectionResponse,
	FindSectionsResponse,
	RemoveSectionResponse,
	UpdateSectionResponse,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import { mockedLearningPath, mockedSection } from '@/app/common/mocks';
import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { DiToken } from '@/infra/common/enums';
import { GrpcSectionsController } from '../grpc.controller';
import { mockedClientSection } from './mocks/sections.mock';
import { mockedFindUseCase, mockedUseCases } from './mocks/use-cases.mock';

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
			providers: [...mockedUseCases],
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

			const result = await sectionsController.find({});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			findUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.find({});

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

			const result = await sectionsController.findOne({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			findOneUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException('non-existent-section-id'),
			);

			const promise = sectionsController.findOne({
				where: { id: 'non-existent-section-id' },
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

			const promise = sectionsController.findOne({
				where: { id: mockedSection.id },
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
		it('should return CreateSectionResponse', async () => {
			const expectedResult: CreateSectionResponse = {
				section: mockedClientSection,
			};

			createUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.create({
				name: mockedSection.name,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
				description: null,
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode LEARNING_PATH_NOT_FOUND', async () => {
			createUseCase.execute.mockRejectedValueOnce(
				new LearningPathNotFoundException(mockedLearningPath.id),
			);

			const promise = sectionsController.create({
				name: mockedSection.name,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
				description: null,
			});

			await expect(promise).rejects.toMatchObject({
				error: {
					message: expect.any(String),
					code: GrpcStatus.NOT_FOUND,
				},
				grpcError: {
					apiCode: LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
				},
			});
		});

		it('should throw GrpcException with INTERNAL status', async () => {
			createUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.create({
				name: mockedSection.name,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
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
		it('should return UpdateSectionResponse', async () => {
			const expectedResult: UpdateSectionResponse = {
				section: mockedClientSection,
			};

			updateUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.update({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status and apiCode SECTION_NOT_FOUND', async () => {
			updateUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException('non-existent-section-id'),
			);

			const promise = sectionsController.update({
				where: { id: 'non-existent-section-id' },
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
			updateUseCase.execute.mockRejectedValueOnce(new Error());

			const promise = sectionsController.update({
				where: { id: mockedSection.id },
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
		it('should return RemoveSectionResponse', async () => {
			const expectedResult: RemoveSectionResponse = {
				section: mockedClientSection,
			};

			removeUseCase.execute.mockResolvedValueOnce(mockedSection);

			const result = await sectionsController.remove({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(expectedResult);
		});

		it('should throw GrpcException with NOT_FOUND status', async () => {
			removeUseCase.execute.mockRejectedValueOnce(
				new SectionNotFoundException('non-existent-section-id'),
			);

			const promise = sectionsController.remove({
				where: { id: 'non-existent-section-id' },
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

			const promise = sectionsController.remove({
				where: { id: mockedSection.id },
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
