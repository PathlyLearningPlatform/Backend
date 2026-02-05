import {
	Activity,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';
import type { DbActivity, DbArticle, DbExercise, DbQuiz } from '../types';

export type DbArticleActivity = {
	activities: DbActivity;
	articles: DbArticle;
};

export type DbQuizActivity = {
	activities: DbActivity;
	quizzes: DbQuiz;
};

export type DbExerciseActivity = {
	activities: DbActivity;
	exercises: DbExercise;
};

export function dbActivityToEntity(db: DbActivity): Activity {
	return new Activity({
		createdAt: db.createdAt,
		updatedAt: db.updatedAt,
		description: db.description,
		id: db.id,
		lessonId: db.lessonId,
		name: db.name,
		order: db.order,
		type: db.type,
	});
}

export function dbQuizToEntity(db: DbQuizActivity): Quiz {
	return new Quiz({
		createdAt: db.activities.createdAt,
		updatedAt: db.activities.updatedAt,
		description: db.activities.description,
		id: db.quizzes.activityId,
		lessonId: db.activities.lessonId,
		name: db.activities.name,
		order: db.activities.order,
		type: db.activities.type,
	});
}

export function dbArticleToEntity(db: DbArticleActivity): Article {
	return new Article({
		createdAt: db.activities.createdAt,
		updatedAt: db.activities.updatedAt,
		description: db.activities.description,
		id: db.articles.activityId,
		lessonId: db.activities.lessonId,
		name: db.activities.name,
		order: db.activities.order,
		type: db.activities.type,
		ref: db.articles.ref,
	});
}

export function dbExerciseToEntity(db: DbExerciseActivity): Exercise {
	return new Exercise({
		createdAt: db.activities.createdAt,
		updatedAt: db.activities.updatedAt,
		description: db.activities.description,
		id: db.exercises.activityId,
		lessonId: db.activities.lessonId,
		name: db.activities.name,
		order: db.activities.order,
		type: db.activities.type,
		difficulty: db.exercises.difficulty,
	});
}
