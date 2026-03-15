import { activityProgressTable, lessonProgressTable } from '../schemas';

export type DbActivityProgress = typeof activityProgressTable.$inferSelect;
export type DbLessonProgress = typeof lessonProgressTable.$inferSelect;
