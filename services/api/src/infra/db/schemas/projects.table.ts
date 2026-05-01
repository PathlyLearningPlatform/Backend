import { ProjectStatus, ProjectSubmissionStatus } from '@/domain/projects';
import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	integer,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';

export const projectStatusEnum = pgEnum('project_status', ProjectStatus);
export const projectSubmissionStatus = pgEnum(
	'project_submission_status',
	ProjectSubmissionStatus,
);

export const projectsTable = pgTable('projects', {
	id: uuid().primaryKey(),
	name: text().notNull(),
	description: text(),
	acceptUrl: text().notNull(),
	createdAt,
	updatedAt,
	repositoryId: integer().notNull().unique(),
});

export const projectProgressTable = pgTable(
	'project_progress',
	{
		projectId: uuid()
			.notNull()
			.references(() => projectsTable.id),
		userId: uuid().notNull(),
		completedAt: timestamp('completed_at'),
		updatedAt,
		status: projectStatusEnum().notNull(),
		repositoryUrl: text().notNull(),
		repositoryId: integer().notNull().unique(),
	},
	(t) => [primaryKey({ columns: [t.projectId, t.userId] })],
);

export const projectSubmissionsTable = pgTable('project_submissions', {
	id: uuid().primaryKey(),
	projectId: uuid()
		.notNull()
		.references(() => projectsTable.id),
	userId: uuid().notNull(),
	updatedAt,
	submittedAt: timestamp('submitted_at').notNull(),
	status: projectSubmissionStatus().notNull(),
	commitSha: text().notNull().unique(),
});
