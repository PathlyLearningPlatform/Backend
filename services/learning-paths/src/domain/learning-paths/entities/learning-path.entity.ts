import type { SortType } from '@pathly-backend/common/index.js';
import type { LearningPathsOrderByFields } from '../enums';

export type LearningPathProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
};

export type LearningPathRequiredCreateProps = Pick<LearningPathProps, 'name'>;
export type LearningPathAllowedCreateProps = Partial<
	Omit<LearningPathProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type LearningPathCreateProps = LearningPathRequiredCreateProps &
	LearningPathAllowedCreateProps;
export type LearningPathUpdateProps = Partial<
	Omit<LearningPathProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type LearningPathQuery = {
	options?: {
		limit?: number;
		page?: number;
		sortType?: SortType;
		orderBy?: LearningPathsOrderByFields;
	};
	where?: {
		name?: string;
	};
};

export class LearningPath implements LearningPathProps {
	constructor(props: LearningPathProps) {
		this.id = props.id;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.name = props.name;
		this.description = props.description;
	}

	update(props: LearningPathUpdateProps) {
		if (props.description !== undefined) {
			this.description = props.description;
		}

		if (props.name !== undefined) {
			this.name = props.name;
		}
	}

	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
}
