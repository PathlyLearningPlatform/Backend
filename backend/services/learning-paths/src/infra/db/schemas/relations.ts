import { defineRelations } from 'drizzle-orm';
import { answersTable } from './answers.table';
import { exercisesTable } from './exercises.table';
import { itemsTable } from './items.table';
import { lessonsTable } from './lessons.table';
import { learningPathsTable } from './learning-paths.table';
import { projectsTable } from './projects.table';
import { questionsTable } from './questions.table';
import { quizzesTable } from './quizzes.table';
import { sectionsTable } from './sections.table';
import { theoryBlocksTable } from './theory-blocks.table';
import { unitsTable } from './units.table';

export const relations = defineRelations(
	{
		projectsTable,
		sectionsTable,
		learningPathsTable,
		unitsTable,
		lessonsTable,
		itemsTable,
		theoryBlocksTable,
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
			items: r.many.itemsTable(),
		},
		itemsTable: {
			lesson: r.one.lessonsTable({
				from: r.itemsTable.lessonId,
				to: r.lessonsTable.id,
			}),
			exercise: r.one.exercisesTable({
				from: r.itemsTable.id,
				to: r.exercisesTable.itemId,
			}),
			theoryBlock: r.one.theoryBlocksTable({
				from: r.itemsTable.id,
				to: r.theoryBlocksTable.itemId,
			}),
			quiz: r.one.quizzesTable({
				from: r.itemsTable.id,
				to: r.quizzesTable.itemId,
			}),
		},
		theoryBlocksTable: {
			item: r.one.itemsTable({
				from: r.theoryBlocksTable.itemId,
				to: r.itemsTable.id,
			}),
		},
		exercisesTable: {
			item: r.one.itemsTable({
				from: r.exercisesTable.itemId,
				to: r.itemsTable.id,
			}),
		},
		quizzesTable: {
			item: r.one.itemsTable({
				from: r.quizzesTable.itemId,
				to: r.itemsTable.id,
			}),
			questions: r.many.questionsTable(),
		},
		questionsTable: {
			quiz: r.one.quizzesTable({
				from: r.questionsTable.quizId,
				to: r.quizzesTable.itemId,
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
