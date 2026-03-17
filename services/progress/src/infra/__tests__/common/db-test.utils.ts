import { ActivityId, ActivityProgress, ActivityProgressId } from '@/domain/activity-progress';
import { UserId, UUID } from '@/domain/common';
import type { DbService } from '@/infra/common/db/db.service';
import {
	LearningPathId,
	LearningPathProgress,
	LearningPathProgressId,
} from '@/domain/learning-path-progress';
import { LessonId, LessonProgress, LessonProgressId } from '@/domain/lesson-progress';
import { SectionId, SectionProgress, SectionProgressId } from '@/domain/section-progress';
import { UnitId, UnitProgress, UnitProgressId } from '@/domain/unit-progress';
import { INFRA_TEST_IDS } from './test.utils';

export const createDbServiceMock = (db: unknown): DbService =>
	({
		getDb: jest.fn().mockReturnValue(db),
	} as unknown as DbService);

export const createSelectListDbMock = <TResult>(rows: TResult[]) => {
	const query = {
		from: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		limit: jest.fn().mockReturnThis(),
		offset: jest.fn().mockResolvedValue(rows),
	};

	return {
		db: {
			select: jest.fn().mockReturnValue(query),
		},
		query,
	};
};

export const createSelectSingleDbMock = <TResult>(rows: TResult[]) => {
	const query = {
		from: jest.fn().mockReturnThis(),
		where: jest.fn().mockResolvedValue(rows),
	};

	return {
		db: {
			select: jest.fn().mockReturnValue(query),
		},
		query,
	};
};

export const createInsertDbMock = () => {
	const query = {
		values: jest.fn().mockReturnThis(),
		onConflictDoUpdate: jest.fn().mockResolvedValue(undefined),
	};

	return {
		db: {
			insert: jest.fn().mockReturnValue(query),
		},
		query,
	};
};

export const createDeleteDbMock = (rows: unknown[]) => {
	const query = {
		where: jest.fn().mockResolvedValue({ rows }),
	};

	return {
		db: {
			delete: jest.fn().mockReturnValue(query),
		},
		query,
	};
};

export const createActivityProgressAggregate = () =>
	ActivityProgress.create(
		ActivityProgressId.create(UUID.create(INFRA_TEST_IDS.activityProgressId)),
		{
			activityId: ActivityId.create(UUID.create(INFRA_TEST_IDS.activityId)),
			lessonId: LessonId.create(UUID.create(INFRA_TEST_IDS.lessonId)),
			userId: UserId.create(UUID.create(INFRA_TEST_IDS.userId)),
		},
	);

export const createLessonProgressAggregate = () =>
	LessonProgress.create(
		LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
		{
			lessonId: LessonId.create(UUID.create(INFRA_TEST_IDS.lessonId)),
			unitId: UnitId.create(UUID.create(INFRA_TEST_IDS.unitId)),
			userId: UserId.create(UUID.create(INFRA_TEST_IDS.userId)),
			totalActivityCount: 3,
		},
	);

export const createUnitProgressAggregate = () =>
	UnitProgress.create(UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)), {
		unitId: UnitId.create(UUID.create(INFRA_TEST_IDS.unitId)),
		sectionId: SectionId.create(UUID.create(INFRA_TEST_IDS.sectionId)),
		userId: UserId.create(UUID.create(INFRA_TEST_IDS.userId)),
		totalLessonCount: 3,
	});

export const createSectionProgressAggregate = () =>
	SectionProgress.create(
		SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
		{
			sectionId: SectionId.create(UUID.create(INFRA_TEST_IDS.sectionId)),
			learningPathId: LearningPathId.create(
				UUID.create(INFRA_TEST_IDS.learningPathId),
			),
			userId: UserId.create(UUID.create(INFRA_TEST_IDS.userId)),
			totalUnitCount: 3,
		},
	);

export const createLearningPathProgressAggregate = () =>
	LearningPathProgress.create(
		LearningPathProgressId.create(
			UUID.create(INFRA_TEST_IDS.learningPathProgressId),
		),
		{
			learningPathId: LearningPathId.create(
				UUID.create(INFRA_TEST_IDS.learningPathId),
			),
			userId: UserId.create(UUID.create(INFRA_TEST_IDS.userId)),
			totalSectionCount: 3,
		},
	);
