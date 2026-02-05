export type UnitProps = {
	id: string;
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
};

export type UnitRequiredCreateProps = Pick<
	UnitProps,
	'name' | 'order' | 'sectionId'
>;
export type UnitAllowedCreateProps = Partial<
	Omit<UnitProps, 'id' | 'createdAt' | 'updatedAt'>
>;
export type UnitCreateProps = UnitRequiredCreateProps & UnitAllowedCreateProps;
export type UnitUpdateProps = Partial<
	Omit<UnitProps, 'id' | 'createdAt' | 'updatedAt' | 'sectionId'>
>;
export type UnitQuery = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {
		name?: string;
		sectionId?: string;
	};
};

export class Unit implements UnitProps {
	constructor(props: UnitProps) {
		this.id = props.id;
		this.sectionId = props.sectionId;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.name = props.name;
		this.description = props.description;
		this.order = props.order;
	}

	update(props: UnitUpdateProps) {
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
	sectionId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
}
