import type { ActivityType } from '../enums';

export interface ActivityProps {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	type: ActivityType;
}

export type ActivityRequiredCreateProps = Pick<
	ActivityProps,
	'lessonId' | 'name' | 'order' | 'type'
>;
export type ActivityAllowedCreateProps = Partial<
	Omit<ActivityProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type ActivityCreateProps = ActivityRequiredCreateProps &
	ActivityAllowedCreateProps;

export type ActivityUpdateProps = Partial<
	Omit<ActivityProps, 'id' | 'createdAt' | 'updatedAt' | 'type'>
>;
export type ActivityQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		lessonId?: string;
	};
};

export class Activity implements ActivityProps {
	constructor(props: ActivityProps) {
		this.id = props.id;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.lessonId = props.lessonId;
		this.name = props.name;
		this.description = props.description;
		this.order = props.order;
		this.type = props.type;
	}

	update(props: ActivityUpdateProps) {
		if (props.description !== undefined) {
			this.description = props.description;
		}

		if (props.lessonId !== undefined) {
			this.lessonId = props.lessonId;
		}

		if (props.name !== undefined) {
			this.name = props.name;
		}

		if (props.order !== undefined) {
			this.order = props.order;
		}
	}

	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	lessonId: string;
	name: string;
	order: number;
	type: ActivityType;
	description: string | null;
}
