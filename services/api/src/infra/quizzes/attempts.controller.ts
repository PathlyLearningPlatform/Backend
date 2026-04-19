import {
	Body,
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '../common';
import {
	CompleteQuizHandler,
	FindQuizAttemptForUserHandler,
	ListQuizAttemptsHandler,
} from '@/app/quizzes';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import {
	CompleteQuizResponseDto,
	FindQuizAttemptByIdResponseDto,
	ListQuizAttemptsResponseDto,
} from './dtos';
import { QuizAttemptNotFoundException } from '@/app/common';
import { QuizNotFoundException } from '@/app/common/exceptions/quiz-not-found.exception';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../auth/user.decorator';
import type { UserInfo } from '../auth/user-info.type';
import { completeQuizSchema } from './schemas';
import z from 'zod';

@Controller({
	path: 'quizzes/:quizId/attempts',
	version: '1',
})
@UseGuards(JwtGuard)
export class QuizAttemptsController {
	constructor(
		@Inject(DiToken.COMPLETE_QUIZ_HANDLER)
		private readonly completeHandler: CompleteQuizHandler,
		@Inject(DiToken.FIND_QUIZ_ATTEMPT_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindQuizAttemptForUserHandler,
		@Inject(DiToken.LIST_QUIZ_ATTEMPTS_HANDLER)
		private readonly listHandler: ListQuizAttemptsHandler,
	) {}

	@ApiOkResponse({ type: ListQuizAttemptsResponseDto })
	@Get()
	async list(
		@User() user: UserInfo,
		@Param('quizId') quizId: string,
	): Promise<ListQuizAttemptsResponseDto> {
		try {
			const result = await this.listHandler.execute({
				where: { userId: user.id, quizId },
				options: {},
			});

			return {
				attempts: result.map((item) => ({
					id: item.id,
					answers: item.answers,
					attemptedAt: item.attemptedAt.toISOString(),
					quizId: item.quizId,
					score: item.score,
					userId: item.userId,
				})),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR, err),
			);
		}
	}

	@ApiOkResponse({ type: FindQuizAttemptByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findForUser(
		@User() user: UserInfo,
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindQuizAttemptByIdResponseDto> {
		try {
			const result = await this.findForUserHandler.execute({
				userId: user.id,
				attemptId: id,
			});

			return {
				attempt: {
					id: result.id,
					answers: result.answers,
					attemptedAt: result.attemptedAt.toISOString(),
					quizId: result.quizId,
					score: result.score,
					userId: result.userId,
				},
			};
		} catch (err) {
			if (err instanceof QuizAttemptNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.QUIZ_ATTEMPT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse({ type: CompleteQuizResponseDto })
	@Post()
	async complete(
		@User() user: UserInfo,
		@Body(new HttpValidationPipe(completeQuizSchema)) body: z.infer<
			typeof completeQuizSchema
		>,
	): Promise<CompleteQuizResponseDto> {
		try {
			const result = await this.completeHandler.execute({
				quizId: body.quizId,
				userId: user.id,
				answers: body.answers,
			});

			return {
				attempt: {
					id: result.id,
					answers: result.answers,
					attemptedAt: result.attemptedAt.toISOString(),
					quizId: result.quizId,
					score: result.score,
					userId: result.userId,
				},
			};
		} catch (err) {
			if (err instanceof QuizNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.QUIZ_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
			);
		}
	}
}
