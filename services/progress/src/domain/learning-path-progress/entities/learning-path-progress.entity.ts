import { SortType } from '@pathly-backend/common/index.js';
import { LearningPathProgressStatus } from '../enums';

export interface LearningPathProgressFields {
	id: string;
	learningPathId: string;
	userId: string;
	status: LearningPathProgressStatus;
	completedAt: Date | null;
	completedSectionsCount: number;
}

export type LearningPathProgressRequiredCreateFields = Pick<
	LearningPathProgressFields,
	'id' | 'learningPathId' | 'userId'
>;
export type LearningPathProgressAllowedCreateFields =
	Partial<LearningPathProgressFields>;
export type LearningPathProgressCreateFields =
	LearningPathProgressRequiredCreateFields &
		LearningPathProgressAllowedCreateFields;

export type LearningPathProgressUpdateFields = Partial<
	Omit<LearningPathProgressFields, 'id' | 'userId' | 'learningPathId'>
>;

export type LearningPathProgressQuery = {
	options?: {
		sortType: SortType;
	};
	where?: {
		userId?: string;
		learningPathId?: string;
	};
};

export class LearningPathProgress implements LearningPathProgressFields {
	constructor(fields: LearningPathProgressCreateFields) {
		this.id = fields.id;
		this.learningPathId = fields.learningPathId;
		this.userId = fields.userId;
		this.status = fields.status ?? LearningPathProgressStatus.NOT_STARTED;
		this.completedAt = fields.completedAt ?? null;
		this.completedSectionsCount = fields.completedSectionsCount ?? 0;
	}

	update(fields: LearningPathProgressUpdateFields) {
		if (fields.completedAt) {
			this.completedAt = fields.completedAt;
		}

		if (fields.completedSectionsCount) {
			this.completedSectionsCount = fields.completedSectionsCount;
		}

		if (fields.status) {
			this.status = fields.status;
		}
	}

	id: string;
	learningPathId: string;
	userId: string;
	status: LearningPathProgressStatus;
	completedAt: Date | null;
	completedSectionsCount: number;
}
