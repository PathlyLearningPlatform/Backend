import { ActivityUpdateProps } from '@/domain/activities/entities';

export type UpdateQuizCommand = {
	where: {
		activityId: string;
	};
	fields?: ActivityUpdateProps;
};
