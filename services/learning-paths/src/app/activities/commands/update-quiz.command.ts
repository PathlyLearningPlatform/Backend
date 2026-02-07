import type { ActivityUpdateFields } from '@/domain/activities/entities';

export type UpdateQuizCommand = {
	where: {
		activityId: string;
	};
	fields?: ActivityUpdateFields;
};
