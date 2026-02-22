export interface ILearningPathsService {
	activityExistsById(id: string): Promise<boolean>;
}
