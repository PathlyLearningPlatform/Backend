export interface IActivity {
	id: string;
	lessonId: string;
}

export interface ILesson {
	id: string;
	unitId: string;
	activityCount: number;
}

export interface IUnit {
	id: string;
	sectionId: string;
	lessonCount: number;
}

export interface ISection {
	id: string;
	learningPathId: string;
	unitCount: number;
}

export interface ILearningPath {
	id: string;
	sectionCount: number;
}

export interface ILearningPathsService {
	findActivityById(id: string): Promise<IActivity | null>;

	findLessonById(id: string): Promise<ILesson | null>;

	findUnitById(id: string): Promise<IUnit | null>;

	findSectionById(id: string): Promise<ISection | null>;

	findLearningPathById(id: string): Promise<ILearningPath | null>;
}
