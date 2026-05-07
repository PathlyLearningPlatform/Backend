import type { Provider } from '@nestjs/common';
import {
	CreateExerciseHandler,
	FindExerciseByIdHandler,
	FindExerciseByRepoIdHandler,
	FindExerciseProgressByRepoIdForUserHandler,
	FindExerciseProgressForUserHandler,
	FindExerciseSubmissionByCommitShaHandler,
	FindExerciseSubmissionByIdHandler,
	FindExerciseSubmissionForUserHandler,
	ListExerciseProgressHandler,
	ListExercisesHandler,
	ListExerciseSubmissionsHandler,
	RemoveExerciseHandler,
	RemoveExerciseProgressHandler,
	RemoveExerciseSubmissionHandler,
	StartExerciseHandler,
	SubmitExerciseHandler,
	UpdateExerciseHandler,
	UpdateExerciseSubmissionHandler,
} from '@app/exercises';
import { DiToken, InMemoryEventBus } from '@infra/common';
import {
	PostgresExerciseRepository,
	PostgresExerciseProgressRepository,
	PostgresExerciseSubmissionRepository,
} from './repositories';
import { IExerciseRepository } from '@/domain/exercises/repositories';
import {
	IExerciseProgressRepository,
	IExerciseSubmissionRepository,
} from '@/domain/exercises/repositories';
import { IEventBus } from '@/app/common';

export const exerciseHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_EXERCISES_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new ListExercisesHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_ID_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new FindExerciseByIdHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new UpdateExerciseHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.CREATE_EXERCISE_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new CreateExerciseHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.START_EXERCISE_HANDLER,
		useFactory(
			exerciseRepository: IExerciseRepository,
			exerciseProgressRepository: IExerciseProgressRepository,
		) {
			return new StartExerciseHandler(
				exerciseRepository,
				exerciseProgressRepository,
			);
		},
		inject: [PostgresExerciseRepository, PostgresExerciseProgressRepository],
	},
	{
		provide: DiToken.SUBMIT_EXERCISE_HANDLER,
		useFactory(
			exerciseRepository: IExerciseRepository,
			exerciseProgressRepository: IExerciseProgressRepository,
			exerciseSubmissionRepository: IExerciseSubmissionRepository,
		) {
			return new SubmitExerciseHandler(
				exerciseRepository,
				exerciseProgressRepository,
				exerciseSubmissionRepository,
			);
		},
		inject: [
			PostgresExerciseRepository,
			PostgresExerciseProgressRepository,
			PostgresExerciseSubmissionRepository,
		],
	},
	{
		provide: DiToken.REMOVE_EXERCISE_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new RemoveExerciseHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.REMOVE_EXERCISE_PROGRESS_HANDLER,
		useFactory(exerciseProgressRepository: IExerciseProgressRepository) {
			return new RemoveExerciseProgressHandler(exerciseProgressRepository);
		},
		inject: [PostgresExerciseProgressRepository],
	},
	{
		provide: DiToken.REMOVE_EXERCISE_SUBMISSION_HANDLER,
		useFactory(exerciseSubmissionRepository: IExerciseSubmissionRepository) {
			return new RemoveExerciseSubmissionHandler(exerciseSubmissionRepository);
		},
		inject: [PostgresExerciseSubmissionRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_SUBMISSION_HANDLER,
		useFactory(
			exerciseProgressRepository: IExerciseProgressRepository,
			exerciseSubmissionRepository: IExerciseSubmissionRepository,
			eventBus: IEventBus,
		) {
			return new UpdateExerciseSubmissionHandler(
				exerciseSubmissionRepository,
				exerciseProgressRepository,
				eventBus,
			);
		},
		inject: [
			PostgresExerciseProgressRepository,
			PostgresExerciseSubmissionRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.FIND_EXERCISE_PROGRESS_BY_REPO_ID_FOR_USER_HANDLER,
		useFactory(exerciseProgressRepository: IExerciseProgressRepository) {
			return new FindExerciseProgressByRepoIdForUserHandler(
				exerciseProgressRepository,
			);
		},
		inject: [PostgresExerciseProgressRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_REPO_ID_HANDLER,
		useFactory(exerciseRepository: IExerciseRepository) {
			return new FindExerciseByRepoIdHandler(exerciseRepository);
		},
		inject: [PostgresExerciseRepository],
	},
	{
		provide: DiToken.LIST_EXERCISE_PROGRESS_HANDLER,
		useFactory(exerciseProgressRepository: IExerciseProgressRepository) {
			return new ListExerciseProgressHandler(exerciseProgressRepository);
		},
		inject: [PostgresExerciseProgressRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_PROGRESS_FOR_USER_HANDLER,
		useFactory(exerciseProgressRepository: IExerciseProgressRepository) {
			return new FindExerciseProgressForUserHandler(exerciseProgressRepository);
		},
		inject: [PostgresExerciseProgressRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_SUBMISSION_BY_COMMIT_SHA_HANDLER,
		async useFactory(
			exerciseSubmissionRepository: IExerciseSubmissionRepository,
		) {
			return new FindExerciseSubmissionByCommitShaHandler(
				exerciseSubmissionRepository,
			);
		},
		inject: [PostgresExerciseSubmissionRepository],
	},
	{
		provide: DiToken.LIST_EXERCISE_SUBMISSIONS_HANDLER,
		useFactory(exerciseSubmissionRepository: IExerciseSubmissionRepository) {
			return new ListExerciseSubmissionsHandler(exerciseSubmissionRepository);
		},
		inject: [PostgresExerciseSubmissionRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_SUBMISSION_BY_ID_HANDLER,
		useFactory(exerciseSubmissionRepository: IExerciseSubmissionRepository) {
			return new FindExerciseSubmissionByIdHandler(
				exerciseSubmissionRepository,
			);
		},
		inject: [PostgresExerciseSubmissionRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_SUBMISSION_FOR_USER_HANDLER,
		useFactory(exerciseSubmissionRepository: IExerciseSubmissionRepository) {
			return new FindExerciseSubmissionForUserHandler(
				exerciseSubmissionRepository,
			);
		},
		inject: [PostgresExerciseSubmissionRepository],
	},
];
