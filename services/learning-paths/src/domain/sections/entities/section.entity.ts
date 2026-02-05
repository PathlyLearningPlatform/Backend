export type SectionProps = {
	id: string;
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type SectionRequiredCreateProps = Pick<
	SectionProps,
	'name' | 'order' | 'learningPathId'
>;
export type SectionAllowedCreateProps = Partial<
	Omit<SectionProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type SectionCreateProps = SectionRequiredCreateProps &
	SectionAllowedCreateProps;
export type SectionUpdateProps = Partial<
	Omit<SectionProps, 'id' | 'createdAt' | 'updatedAt' | 'learningPathId'>
>;
export type SectionQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		learningPathId?: string;
	};
};

export class Section implements SectionProps {
	constructor(props: SectionProps) {
		this.id = props.id;
		this.learningPathId = props.learningPathId;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.name = props.name;
		this.description = props.description;
		this.order = props.order;
	}

	update(props: SectionUpdateProps) {
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
	learningPathId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
