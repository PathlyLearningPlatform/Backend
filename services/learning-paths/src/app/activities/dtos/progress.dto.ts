export interface ActivityProgressDto {
	id: string;
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
}
