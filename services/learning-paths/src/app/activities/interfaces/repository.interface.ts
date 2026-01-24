import {
	Activity,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';
import { FindActivitiesCommand } from '../commands/find.command';

export interface IActivitiesRepository {
	find(command: FindActivitiesCommand): Promise<Activity[]>;

	findOne(id: string): Promise<Activity | null>;
	findOneArticle(activityId: string): Promise<Article | null>;
	findOneExercise(activityId: string): Promise<Exercise | null>;
	findOneQuiz(activityId: string): Promise<Quiz | null>;

	save(entity: Activity): Promise<void>;
	saveArticle(entity: Article): Promise<void>;
	saveExercise(entity: Exercise): Promise<void>;
	saveQuiz(entity: Quiz): Promise<void>;

	remove(id: string): Promise<boolean>;
}
