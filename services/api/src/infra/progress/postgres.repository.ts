import { UserId } from '@/domain/common';
import { LearningPathId } from '@/domain/learning-paths';
import { Db } from '../db/types';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { DbException } from '@infra/common';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import {
	activitiesTable,
	activityProgressTable,
	learningPathProgressTable,
	learningPathsTable,
	lessonProgressTable,
	lessonsTable,
	sectionProgressTable,
	sectionsTable,
	unitProgressTable,
	unitsTable,
} from '../db/schemas';

@Injectable()
export class PostgresProgressRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findForLearningPath(id: LearningPathId, userId: UserId) {
		try {
			const userIdValue = userId.toString();
			const learningPathId = id.value;

			const [learningPath] = await this.db
				.select({
					id: learningPathsTable.id,
					name: learningPathsTable.name,
					totalSectionCount: learningPathProgressTable.totalSectionCount,
					completedSectionCount:
						learningPathProgressTable.completedSectionCount,
				})
				.from(learningPathsTable)
				.innerJoin(
					learningPathProgressTable,
					and(
						eq(learningPathProgressTable.learningPathId, learningPathsTable.id),
						eq(learningPathProgressTable.userId, userIdValue),
					),
				)
				.where(eq(learningPathsTable.id, learningPathId))
				.limit(1);

			if (!learningPath) {
				console.log('learning path not started');
				return null;
			}

			let [currentSectionRow] = await this.db
				.select({
					id: sectionsTable.id,
					name: sectionsTable.name,
					order: sectionsTable.order,
					completedUnitCount: sectionProgressTable.completedUnitCount,
					totalUnitCount: sectionProgressTable.totalUnitCount,
					fallbackTotalUnitCount: sectionsTable.unitCount,
				})
				.from(sectionsTable)
				.leftJoin(
					sectionProgressTable,
					and(
						eq(sectionProgressTable.sectionId, sectionsTable.id),
						eq(sectionProgressTable.userId, userIdValue),
					),
				)
				.where(
					and(
						eq(sectionsTable.learningPathId, learningPathId),
						isNull(sectionProgressTable.completedAt),
					),
				)
				.orderBy(asc(sectionsTable.order))
				.limit(1);

			if (!currentSectionRow) {
				[currentSectionRow] = await this.db
					.select({
						id: sectionsTable.id,
						name: sectionsTable.name,
						order: sectionsTable.order,
						totalUnitCount: sectionsTable.unitCount,
						completedUnitCount: sql<number>`0`.as('completed_unit_count'),
						fallbackTotalUnitCount: sectionsTable.unitCount,
					})
					.from(sectionsTable)
					.where(eq(sectionsTable.learningPathId, learningPathId))
					.orderBy(asc(sectionsTable.order))
					.limit(1);
			}

			if (!currentSectionRow) {
				console.log('section progress not found');
				return null;
			}

			const currentSection = {
				id: currentSectionRow.id,
				name: currentSectionRow.name,
				order: currentSectionRow.order,
				totalUnitCount:
					currentSectionRow.totalUnitCount ??
					currentSectionRow.fallbackTotalUnitCount,
				completedUnitCount: currentSectionRow.completedUnitCount ?? 0,
			};

			let [currentUnitRow] = await this.db
				.select({
					id: unitsTable.id,
					name: unitsTable.name,
					order: unitsTable.order,
					completedLessonCount: unitProgressTable.completedLessonCount,
					totalLessonCount: unitProgressTable.totalLessonCount,
					fallbackTotalLessonCount: unitsTable.lessonCount,
				})
				.from(unitsTable)
				.leftJoin(
					unitProgressTable,
					and(
						eq(unitProgressTable.unitId, unitsTable.id),
						eq(unitProgressTable.userId, userIdValue),
					),
				)
				.where(
					and(
						eq(unitsTable.sectionId, currentSection.id),
						isNull(unitProgressTable.completedAt),
					),
				)
				.orderBy(asc(unitsTable.order))
				.limit(1);

			if (!currentUnitRow) {
				[currentUnitRow] = await this.db
					.select({
						id: unitsTable.id,
						name: unitsTable.name,
						order: unitsTable.order,
						completedLessonCount: sql<number>`0`.as('completed_lesson_count'),
						totalLessonCount: unitProgressTable.totalLessonCount,
						fallbackTotalLessonCount: unitsTable.lessonCount,
					})
					.from(unitsTable)
					.where(eq(unitsTable.sectionId, currentSection.id))
					.orderBy(asc(unitsTable.order))
					.limit(1);
			}

			if (!currentUnitRow) {
				console.log('unit progress not found');
				return null;
			}

			const currentUnit = {
				id: currentUnitRow.id,
				name: currentUnitRow.name,
				order: currentUnitRow.order,
				totalLessonCount:
					currentUnitRow.totalLessonCount ??
					currentUnitRow.fallbackTotalLessonCount,
				completedLessonCount: currentUnitRow.completedLessonCount ?? 0,
			};

			let [currentLessonRow] = await this.db
				.select({
					id: lessonsTable.id,
					name: lessonsTable.name,
					order: lessonsTable.order,
					completedActivityCount: lessonProgressTable.completedActivityCount,
					totalActivityCount: lessonProgressTable.totalActivityCount,
					fallbackTotalActivityCount: lessonsTable.activityCount,
				})
				.from(lessonsTable)
				.leftJoin(
					lessonProgressTable,
					and(
						eq(lessonProgressTable.lessonId, lessonsTable.id),
						eq(lessonProgressTable.userId, userIdValue),
					),
				)
				.where(
					and(
						eq(lessonsTable.unitId, currentUnit.id),
						isNull(lessonProgressTable.completedAt),
					),
				)
				.orderBy(asc(lessonsTable.order))
				.limit(1);

			if (!currentLessonRow) {
				[currentLessonRow] = await this.db
					.select({
						id: lessonsTable.id,
						name: lessonsTable.name,
						order: lessonsTable.order,
						completedActivityCount: sql<number>`0`.as(
							'completed_activity_count',
						),
						totalActivityCount: lessonProgressTable.totalActivityCount,
						fallbackTotalActivityCount: lessonsTable.activityCount,
					})
					.from(lessonsTable)
					.where(eq(lessonsTable.unitId, currentUnit.id))
					.orderBy(asc(lessonsTable.order))
					.limit(1);
			}

			if (!currentLessonRow) {
				console.log('lesson progress not found');
				return null;
			}

			const currentLesson = {
				id: currentLessonRow.id,
				name: currentLessonRow.name,
				order: currentLessonRow.order,
				totalActivityCount:
					currentLessonRow.totalActivityCount ??
					currentLessonRow.fallbackTotalActivityCount,
				completedActivityCount: currentLessonRow.completedActivityCount ?? 0,
			};

			let [currentActivity] = await this.db
				.select({
					id: activitiesTable.id,
					name: activitiesTable.name,
					order: activitiesTable.order,
				})
				.from(activitiesTable)
				.leftJoin(
					activityProgressTable,
					and(
						eq(activityProgressTable.activityId, activitiesTable.id),
						eq(activityProgressTable.userId, userIdValue),
					),
				)
				.where(
					and(
						eq(activitiesTable.lessonId, currentLesson.id),
						isNull(activityProgressTable.completedAt),
					),
				)
				.orderBy(asc(activitiesTable.order))
				.limit(1);

			if (!currentActivity) {
				[currentActivity] = await this.db
					.select({
						id: activitiesTable.id,
						name: activitiesTable.name,
						order: activitiesTable.order,
					})
					.from(activitiesTable)
					.where(eq(activitiesTable.lessonId, currentLesson.id))
					.orderBy(asc(activitiesTable.order))
					.limit(1);
			}

			if (!currentActivity) {
				console.log('activity progress not found');
				return null;
			}

			const sectionsInCurrentLearningPath = await this.db
				.select({
					id: sectionsTable.id,
					name: sectionsTable.name,
					order: sectionsTable.order,
					completedAt: sectionProgressTable.completedAt,
				})
				.from(sectionsTable)
				.leftJoin(
					sectionProgressTable,
					and(
						eq(sectionProgressTable.sectionId, sectionsTable.id),
						eq(sectionProgressTable.userId, userIdValue),
					),
				)
				.where(eq(sectionsTable.learningPathId, learningPathId))
				.orderBy(asc(sectionsTable.order));

			const unitsInCurrentSection = await this.db
				.select({
					id: unitsTable.id,
					name: unitsTable.name,
					order: unitsTable.order,
					completedAt: unitProgressTable.completedAt,
				})
				.from(unitsTable)
				.leftJoin(
					unitProgressTable,
					and(
						eq(unitProgressTable.unitId, unitsTable.id),
						eq(unitProgressTable.userId, userIdValue),
					),
				)
				.where(eq(unitsTable.sectionId, currentSection.id))
				.orderBy(asc(unitsTable.order));

			const lessonsInCurrentUnit = await this.db
				.select({
					id: lessonsTable.id,
					name: lessonsTable.name,
					order: lessonsTable.order,
					completedAt: lessonProgressTable.completedAt,
				})
				.from(lessonsTable)
				.leftJoin(
					lessonProgressTable,
					and(
						eq(lessonProgressTable.lessonId, lessonsTable.id),
						eq(lessonProgressTable.userId, userIdValue),
					),
				)
				.where(eq(lessonsTable.unitId, currentUnit.id))
				.orderBy(asc(lessonsTable.order));

			const activitiesInCurrentLesson = await this.db
				.select({
					id: activitiesTable.id,
					name: activitiesTable.name,
					order: activitiesTable.order,
					completedAt: activityProgressTable.completedAt,
				})
				.from(activitiesTable)
				.leftJoin(
					activityProgressTable,
					and(
						eq(activityProgressTable.activityId, activitiesTable.id),
						eq(activityProgressTable.userId, userIdValue),
					),
				)
				.where(eq(activitiesTable.lessonId, currentLesson.id))
				.orderBy(asc(activitiesTable.order));

			return {
				...learningPath,
				current: {
					section: currentSection,
					unit: currentUnit,
					lesson: currentLesson,
					activity: currentActivity,
				},
				sectionsInCurrentLearningPath,
				unitsInCurrentSection,
				lessonsInCurrentUnit,
				activitiesInCurrentLesson,
			};
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
