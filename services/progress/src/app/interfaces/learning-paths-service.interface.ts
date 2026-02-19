export interface ILearningPath {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
}

export interface ILearningPathService {
	findOneLearningPath(): Promise<ILearningPath>;
}
