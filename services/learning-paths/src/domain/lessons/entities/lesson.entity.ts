export type LessonProps = {
	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type LessonRequiredCreateProps = Pick<
	LessonProps,
	'name' | 'order' | 'unitId'
>;
export type LessonAllowedCreateProps = Partial<
	Omit<LessonProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type LessonCreateProps = LessonRequiredCreateProps &
	LessonAllowedCreateProps;
export type LessonUpdateProps = Partial<
	Omit<LessonProps, 'id' | 'createdAt' | 'updatedAt' | 'unitId'>
>;
export type LessonQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		unitId?: string;
	};
};

export class Lesson implements LessonProps {
	constructor(props: LessonProps) {
		this.id = props.id;
		this.unitId = props.unitId;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.name = props.name;
		this.description = props.description;
		this.order = props.order;
	}

	update(props: LessonUpdateProps) {
		if (props.description !== undefined) {
			this.description = props.description;
		}

		if (props.name !== undefined) {
			this.name = props.name;
		}

		if (props.order !== undefined) {
			this.order = props.order;
		}
	}

	id: string;
	unitId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
