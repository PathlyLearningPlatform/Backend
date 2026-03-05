export interface IActivity {
	id: string;
	lessonId: string;
}

export interface ILesson {
	id: string;
	unitId: string;
	activityCount: number;
}

export interface ILearningPathsService {
	activityExistsById(id: string): Promise<boolean>;
	findActivityById(id: string): Promise<IActivity | null>;

	findLessonById(id: string): Promise<ILesson | null>;
}
