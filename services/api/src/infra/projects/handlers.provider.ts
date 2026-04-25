import type { Provider } from '@nestjs/common';
import {
	CreateProjectHandler,
	RemoveProjectProgressHandler,
	RemoveProjectSubmissionHandler,
	StartProjectHandler,
	SubmitProjectHandler,
	UpdateProjectHandler,
	UpdateProjectSubmissionHandler,
} from '@/app/projects/commands';
import { RemoveProjectHandler } from '@/app/projects/commands/remove.command';
import {
	FindOneProjectProgressForUserHandler,
	FindOneProjectSubmissionForUserHandler,
	FindProjectByIdHandler,
	FindProjectSubmissionByIdHandler,
	ListProjectProgressHandler,
	ListProjectsHandler,
	ListProjectSubmissionsHandler,
} from '@/app/projects/queries';
import type {
	IProjectProgressRepository,
	IProjectRepository,
	IProjectSubmissionRepository,
} from '@/domain/projects';
import { DiToken } from '@infra/common';
import {
	PostgresProjectProgressRepository,
	PostgresProjectRepository,
	PostgresProjectSubmissionRepository,
} from './repositories';

export const projectHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_PROJECTS_HANDLER,
		useFactory(projectRepository: IProjectRepository) {
			return new ListProjectsHandler(projectRepository);
		},
		inject: [PostgresProjectRepository],
	},
	{
		provide: DiToken.FIND_PROJECT_BY_ID_HANDLER,
		useFactory(projectRepository: IProjectRepository) {
			return new FindProjectByIdHandler(projectRepository);
		},
		inject: [PostgresProjectRepository],
	},
	{
		provide: DiToken.CREATE_PROJECT_HANDLER,
		useFactory(projectRepository: IProjectRepository) {
			return new CreateProjectHandler(projectRepository);
		},
		inject: [PostgresProjectRepository],
	},
	{
		provide: DiToken.UPDATE_PROJECT_HANDLER,
		useFactory(projectRepository: IProjectRepository) {
			return new UpdateProjectHandler(projectRepository);
		},
		inject: [PostgresProjectRepository],
	},
	{
		provide: DiToken.REMOVE_PROJECT_HANDLER,
		useFactory(projectRepository: IProjectRepository) {
			return new RemoveProjectHandler(projectRepository);
		},
		inject: [PostgresProjectRepository],
	},
	{
		provide: DiToken.START_PROJECT_HANDLER,
		useFactory(
			projectProgressRepository: IProjectProgressRepository,
			projectRepository: IProjectRepository,
		) {
			return new StartProjectHandler(
				projectProgressRepository,
				projectRepository,
			);
		},
		inject: [PostgresProjectProgressRepository, PostgresProjectRepository],
	},
	{
		provide: DiToken.REMOVE_PROJECT_PROGRESS_HANDLER,
		useFactory(projectProgressRepository: IProjectProgressRepository) {
			return new RemoveProjectProgressHandler(projectProgressRepository);
		},
		inject: [PostgresProjectProgressRepository],
	},
	{
		provide: DiToken.LIST_PROJECT_PROGRESS_HANDLER,
		useFactory(projectProgressRepository: IProjectProgressRepository) {
			return new ListProjectProgressHandler(projectProgressRepository);
		},
		inject: [PostgresProjectProgressRepository],
	},
	{
		provide: DiToken.FIND_ONE_PROJECT_PROGRESS_FOR_USER_HANDLER,
		useFactory(projectProgressRepository: IProjectProgressRepository) {
			return new FindOneProjectProgressForUserHandler(
				projectProgressRepository,
			);
		},
		inject: [PostgresProjectProgressRepository],
	},
	{
		provide: DiToken.SUBMIT_PROJECT_HANDLER,
		useFactory(
			projectRepository: IProjectRepository,
			projectProgressRepository: IProjectProgressRepository,
			projectSubmissionRepository: IProjectSubmissionRepository,
		) {
			return new SubmitProjectHandler(
				projectRepository,
				projectProgressRepository,
				projectSubmissionRepository,
			);
		},
		inject: [
			PostgresProjectRepository,
			PostgresProjectProgressRepository,
			PostgresProjectSubmissionRepository,
		],
	},
	{
		provide: DiToken.REMOVE_PROJECT_SUBMISSION_HANDLER,
		useFactory(projectSubmissionRepository: IProjectSubmissionRepository) {
			return new RemoveProjectSubmissionHandler(projectSubmissionRepository);
		},
		inject: [PostgresProjectSubmissionRepository],
	},
	{
		provide: DiToken.UPDATE_PROJECT_SUBMISSION_HANDLER,
		useFactory(
			projectSubmissionRepository: IProjectSubmissionRepository,
			projectProgressRepository: IProjectProgressRepository,
		) {
			return new UpdateProjectSubmissionHandler(
				projectSubmissionRepository,
				projectProgressRepository,
			);
		},
		inject: [
			PostgresProjectSubmissionRepository,
			PostgresProjectProgressRepository,
		],
	},
	{
		provide: DiToken.LIST_PROJECT_SUBMISSIONS_HANDLER,
		useFactory(projectSubmissionRepository: IProjectSubmissionRepository) {
			return new ListProjectSubmissionsHandler(projectSubmissionRepository);
		},
		inject: [PostgresProjectSubmissionRepository],
	},
	{
		provide: DiToken.FIND_PROJECT_SUBMISSION_BY_ID_HANDLER,
		useFactory(projectSubmissionRepository: IProjectSubmissionRepository) {
			return new FindProjectSubmissionByIdHandler(projectSubmissionRepository);
		},
		inject: [PostgresProjectSubmissionRepository],
	},
	{
		provide: DiToken.FIND_ONE_PROJECT_SUBMISSION_FOR_USER_HANDLER,
		useFactory(projectSubmissionRepository: IProjectSubmissionRepository) {
			return new FindOneProjectSubmissionForUserHandler(
				projectSubmissionRepository,
			);
		},
		inject: [PostgresProjectSubmissionRepository],
	},
];
