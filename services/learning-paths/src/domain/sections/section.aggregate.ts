import { AggregateRoot } from '../common';
import { SectionDescription, SectionName } from './value-objects';
import { SectionId } from './value-objects/id.vo';
import { LearningPathId } from '../learning-paths/value-objects';

type SectionProps = {
	learningPathId: LearningPathId;
	name: SectionName;
	description: SectionDescription | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
};
type CreateSectionProps = {
	learningPathId: LearningPathId;
	name: SectionName;
	description?: SectionDescription | null;
	createdAt: Date;
	order: number;
};
type UpdateSectionProps = Partial<Pick<SectionProps, 'name' | 'description'>>;
type SectionFromDataSourceProps = {
	id: string;
	learningPathId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
};

export class Section extends AggregateRoot<SectionId, SectionProps> {
	private readonly _props: SectionProps;

	private constructor(id: SectionId, props: SectionProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(props: SectionFromDataSourceProps) {
		const id = SectionId.create(props.id);
		const learningPathId = LearningPathId.create(props.learningPathId);
		const name = SectionName.create(props.name);
		const description = props.description
			? SectionDescription.create(props.description)
			: null;

		const section = new Section(id, {
			learningPathId,
			name,
			description,
			order: props.order,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});

		return section;
	}

	static create(id: SectionId, props: CreateSectionProps) {
		const section = new Section(id, {
			name: props.name,
			createdAt: props.createdAt,
			description: props.description ?? null,
			learningPathId: props.learningPathId,
			updatedAt: null,
			order: props.order,
		});

		return section;
	}

	get id(): SectionId {
		return this._id;
	}
	get learningPathId(): LearningPathId {
		return this._props.learningPathId;
	}
	get name(): SectionName {
		return this._props.name;
	}
	get description(): SectionDescription | null {
		return this._props.description;
	}
	get createdAt(): Date {
		return this._props.createdAt;
	}
	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
	get order(): number {
		return this._props.order;
	}

	update(now: Date, props?: UpdateSectionProps) {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		this._props.updatedAt = now;
	}

	ensureCanRemove() {}
}
