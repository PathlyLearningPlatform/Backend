import type {
	projectProgressTable,
	projectsTable,
	projectSubmissionsTable,
} from '@/infra/db/schemas';

export type DbProject = typeof projectsTable.$inferSelect;

export type DbProjectProgress = typeof projectProgressTable.$inferSelect;

export type DbProjectSubmission = typeof projectSubmissionsTable.$inferSelect;
