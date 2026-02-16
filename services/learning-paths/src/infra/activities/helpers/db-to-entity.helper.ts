import {
	Activity,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';
import type {
	DbActivity,
	DbArticle,
	DbExercise,
	DbQuestion,
	DbQuiz,
} from '../types';
import { Question } from '@/domain/activities/entities/question.entity';

export type DbArticleActivity = {
	activities: DbActivity;
	articles: DbArticle;
};

export type DbQuizActivity = {
	activity: DbActivity;
	quiz: DbQuiz;
	questions: DbQuestion[];
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
	const questions: Question[] = [];

	for (const q of db.questions) {
		questions.push(new Question(q));
	}

	return new Quiz({
		createdAt: db.activity.createdAt,
		updatedAt: db.activity.updatedAt,
		description: db.activity.description,
		id: db.quiz.activityId,
		lessonId: db.activity.lessonId,
		name: db.activity.name,
		order: db.activity.order,
		type: db.activity.type,
		nextQuestionOrder: db.quiz.nextQuestionOrder,
		questions: questions,
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
