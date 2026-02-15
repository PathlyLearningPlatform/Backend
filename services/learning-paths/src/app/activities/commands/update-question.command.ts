import { QuestionUpdateFields } from '@/domain/activities/entities/question.entity';

export type UpdateQuestionCommand = {
	where: {
		quizId: string;
		id: number;
	};
	fields?: QuestionUpdateFields;
};
