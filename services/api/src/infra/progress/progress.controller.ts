import {
	Controller,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LearningPathProgressResponseDto } from './dtos';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../auth/decorators';
import { type UserInfo } from '../auth/types';
import { ExceptionMessage, HttpErrorDto } from '../common';
import { PostgresProgressRepository } from './postgres.repository';
import { LearningPathId } from '@/domain/learning-paths';
import { UserId, UUID } from '@/domain/common';

@ApiTags('progress')
@UseGuards(JwtGuard)
@Controller({
	path: 'progress',
	version: '1',
})
export class ProgressController {
	constructor(
		private readonly progressRepository: PostgresProgressRepository,
	) {}

	@ApiOkResponse({ type: LearningPathProgressResponseDto })
	@Get(':learningPathId')
	async findForLearningPath(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<LearningPathProgressResponseDto> {
		try {
			const pathId = LearningPathId.create(learningPathId);
			const userId = UserId.create(UUID.create(user.id));

			const progress = await this.progressRepository.findForLearningPath(
				pathId,
				userId,
			);

			if (!progress) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_STARTED),
				);
			}

			const toIsoString = (value: Date | null) =>
				value ? value.toISOString() : null;

			return {
				...progress,
				sectionsInCurrentLearningPath:
					progress.sectionsInCurrentLearningPath.map((section) => ({
						...section,
						completedAt: toIsoString(section.completedAt),
					})),
				unitsInCurrentSection: progress.unitsInCurrentSection.map((unit) => ({
					...unit,
					completedAt: toIsoString(unit.completedAt),
				})),
				lessonsInCurrentUnit: progress.lessonsInCurrentUnit.map((lesson) => ({
					...lesson,
					completedAt: toIsoString(lesson.completedAt),
				})),
				activitiesInCurrentLesson: progress.activitiesInCurrentLesson.map(
					(activity) => ({
						...activity,
						completedAt: toIsoString(activity.completedAt),
					}),
				),
			};
		} catch (err) {
			if (err instanceof NotFoundException) {
				throw err;
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
