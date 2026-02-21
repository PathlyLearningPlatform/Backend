export interface ILearningPath {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
}

export interface ILearningPathsService {
	findOneLearningPath(id: string): Promise<ILearningPath | null>;
}
