import type {
	activityProgressTable,
	lessonProgressTable,
	learningPathProgressTable,
	sectionProgressTable,
	unitProgressTable,
} from '../schemas';

export type DbActivityProgress = typeof activityProgressTable.$inferSelect;
export type DbLessonProgress = typeof lessonProgressTable.$inferSelect;
export type DbUnitProgress = typeof unitProgressTable.$inferSelect;
export type DbSectionProgress = typeof sectionProgressTable.$inferSelect;
export type DbLearningPathProgress =
	typeof learningPathProgressTable.$inferSelect;
