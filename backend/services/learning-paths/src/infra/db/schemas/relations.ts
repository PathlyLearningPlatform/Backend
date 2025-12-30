import { defineRelations } from 'drizzle-orm';
import { answersTable } from './answers.table';
import { exercisesTable } from './exercises.table';
import { activitiesTable } from './activities.table';
import { learningPathsTable } from './learning-paths.table';
import { lessonsTable } from './lessons.table';
import { projectsTable } from './projects.table';
import { questionsTable } from './questions.table';
import { quizzesTable } from './quizzes.table';
import { sectionsTable } from './sections.table';
import { articlesTable } from './articles.table';
import { unitsTable } from './units.table';

export const relations = defineRelations(
	{
		projectsTable,
		sectionsTable,
		learningPathsTable,
		unitsTable,
		lessonsTable,
		activitiesTable,
		articlesTable,
		quizzesTable,
		exercisesTable,
		questionsTable,
		answersTable,
	},
	(r) => ({
		projectsTable: {
			section: r.one.sectionsTable({
				from: r.projectsTable.sectionId,
				to: r.sectionsTable.id,
			}),
			path: r.one.learningPathsTable({
				from: r.projectsTable.learningPathId,
				to: r.learningPathsTable.id,
			}),
		},
		pathsTable: {
			projects: r.many.projectsTable(),
			sections: r.many.sectionsTable(),
		},
		sectionsTable: {
			projects: r.many.projectsTable(),
			units: r.many.unitsTable(),
			path: r.one.learningPathsTable({
				from: r.sectionsTable.learningPathId,
				to: r.learningPathsTable.id,
			}),
		},
		unitsTable: {
			section: r.one.sectionsTable({
				from: r.unitsTable.sectionId,
				to: r.sectionsTable.id,
			}),
			lessons: r.many.lessonsTable(),
		},
		lessonsTable: {
			unit: r.one.unitsTable({
				from: r.lessonsTable.unitId,
				to: r.unitsTable.id,
			}),
			items: r.many.activitiesTable(),
		},
		itemsTable: {
			lesson: r.one.lessonsTable({
				from: r.activitiesTable.lessonId,
				to: r.lessonsTable.id,
			}),
			exercise: r.one.exercisesTable({
				from: r.activitiesTable.id,
				to: r.exercisesTable.activityId,
			}),
			theoryBlock: r.one.articlesTable({
				from: r.activitiesTable.id,
				to: r.articlesTable.activityId,
			}),
			quiz: r.one.quizzesTable({
				from: r.activitiesTable.id,
				to: r.quizzesTable.activityId,
			}),
		},
		theoryBlocksTable: {
			item: r.one.activitiesTable({
				from: r.articlesTable.activityId,
				to: r.activitiesTable.id,
			}),
		},
		exercisesTable: {
			item: r.one.activitiesTable({
				from: r.exercisesTable.activityId,
				to: r.activitiesTable.id,
			}),
		},
		quizzesTable: {
			item: r.one.activitiesTable({
				from: r.quizzesTable.activityId,
				to: r.activitiesTable.id,
			}),
			questions: r.many.questionsTable(),
		},
		questionsTable: {
			quiz: r.one.quizzesTable({
				from: r.questionsTable.quizId,
				to: r.quizzesTable.activityId,
			}),
			answers: r.many.answersTable(),
		},
		answersTable: {
			question: r.one.questionsTable({
				from: r.answersTable.questionId,
				to: r.questionsTable.id,
			}),
		},
	}),
);
