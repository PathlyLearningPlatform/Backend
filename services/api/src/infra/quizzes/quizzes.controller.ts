import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type {
	AddQuestionHandler,
	RemoveQuestionHandler,
	UpdateQuestionHandler,
	FindQuizByIdHandler,
	AddQuizHandler,
} from '@/app/quizzes';
import {
	ActivityNotFoundException,
	LessonNotFoundException,
	QuestionNotFoundException,
} from '@/app/common';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateQuestionResponseDto,
	CreateQuizDto,
	CreateQuizResponseDto,
	FindQuestionByIdResponseDto,
	FindQuizByIdResponseDto,
	ListQuestionsResponseDto,
	RemoveQuestionResponseDto,
	UpdateQuestionResponseDto,
	UpdateQuizDto,
	UpdateQuizResponseDto,
} from './dtos';
import type { CreateQuestionDto, UpdateQuestionDto } from './dtos';
import {
	clientQuestionToResponseDto,
	clientQuizToResponseDto,
} from './helpers';
import {
	createQuestionSchema,
	createQuizSchema,
	updateQuestionSchema,
	updateQuizPropsSchema,
} from './schemas';

@Controller({
	path: 'quizzes',
	version: '1',
})
export class QuizzesController {
	constructor(
		@Inject(DiToken.FIND_QUIZ_BY_ID_HANDLER)
		private readonly findQuizByIdHandler: FindQuizByIdHandler,
		@Inject(DiToken.ADD_QUIZ_HANDLER)
		private readonly addQuizHandler: AddQuizHandler,
		@Inject(DiToken.ADD_QUESTION_HANDLER)
		private readonly addQuestionHandler: AddQuestionHandler,
		@Inject(DiToken.UPDATE_QUESTION_HANDLER)
		private readonly updateQuestionHandler: UpdateQuestionHandler,
		@Inject(DiToken.REMOVE_QUESTION_HANDLER)
		private readonly removeQuestionHandler: RemoveQuestionHandler,
	) {}

	@ApiOkResponse({ type: FindQuizByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindQuizByIdResponseDto> {
		try {
			const result = await this.findQuizByIdHandler.execute({
				where: { id },
			});

			return {
				quiz: clientQuizToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiBody({ type: CreateQuizDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiCreatedResponse({ type: CreateQuizResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createQuizSchema))
		body: CreateQuizDto,
	): Promise<CreateQuizResponseDto> {
		try {
			const result = await this.addQuizHandler.execute({
				name: body.name,
				description: body.description,
				lessonId: body.lessonId,
			});

			return {
				quiz: clientQuizToResponseDto({ ...result, questions: [] }),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiBody({ type: UpdateQuizDto })
	@ApiOkResponse({ type: UpdateQuizResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) _id: string,
		@Body(new HttpValidationPipe(updateQuizPropsSchema))
		_body: UpdateQuizDto,
	): Promise<UpdateQuizResponseDto> {
		throw new InternalServerErrorException(
			new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
		);
	}

	@ApiOkResponse({
		type: ListQuestionsResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Get(':id/questions')
	async listQuestions(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ListQuestionsResponseDto> {
		try {
			const result = await this.findQuizByIdHandler.execute({
				where: { id },
			});

			return {
				questions: result.questions.map(clientQuestionToResponseDto),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({
		type: FindQuestionByIdResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Get(':id/questions/:questionId')
	async findQuestionById(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
	): Promise<FindQuestionByIdResponseDto> {
		try {
			const quiz = await this.findQuizByIdHandler.execute({
				where: { id },
			});
			const question = quiz.questions.find((item) => item.id === questionId);

			if (!question) {
				throw new QuestionNotFoundException(questionId);
			}

			return {
				question: clientQuestionToResponseDto(question),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			if (err instanceof QuestionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.QUESTION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiCreatedResponse({
		type: CreateQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Post(':id/questions')
	async createQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(createQuestionSchema))
		body: CreateQuestionDto,
	): Promise<CreateQuestionResponseDto> {
		try {
			const result = await this.addQuestionHandler.execute({
				content: body.content,
				correctAnswer: body.correctAnswer,
				quizId: id,
			});

			return {
				question: clientQuestionToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({
		type: UpdateQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Patch(':id/questions/:questionId')
	async updateQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
		@Body(new HttpValidationPipe(updateQuestionSchema))
		body: UpdateQuestionDto,
	): Promise<UpdateQuestionResponseDto> {
		try {
			const result = await this.updateQuestionHandler.execute({
				props: {
					content: body.content,
					correctAnswer: body.correctAnswer,
				},
				questionId,
				quizId: id,
			});

			return {
				question: clientQuestionToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			if (err instanceof QuestionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.QUESTION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({
		type: RemoveQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Delete(':id/questions/:questionId')
	async removeQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
	): Promise<RemoveQuestionResponseDto> {
		try {
			await this.removeQuestionHandler.execute({
				questionId,
				quizId: id,
			});

			return {};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			if (err instanceof QuestionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.QUESTION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}
}
