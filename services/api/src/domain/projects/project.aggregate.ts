import { AggregateRoot, UUID } from '../common';
import { UnitId } from '../units';
import { ProjectId } from './value-objects';

export type ProjectProps = {
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	afterUnitId: UnitId | null;
};

export type CreateProjectProps = {
	name: string;
	description?: string;
	createdAt: Date;
	afterUnitId?: UnitId;
};

export type ProjectFromDataSourceProps = {
	id: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	afterUnitId: string | null;
};

export type UpdateProjectProps = Partial<{
	name: string;
	description: string | null;
	afterUnitId: UnitId | null;
}>;

export class Project extends AggregateRoot<ProjectId, ProjectProps> {
	private _props: ProjectProps;

	private constructor(id: ProjectId, props: ProjectProps) {
		super(id);
		this._props = props;
	}

	static create(id: ProjectId, props: CreateProjectProps): Project {
		return new Project(id, {
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			afterUnitId: props.afterUnitId ?? null,
		});
	}

	static fromDataSource(props: ProjectFromDataSourceProps): Project {
		return new Project(ProjectId.create(UUID.create(props.id)), {
			name: props.name,
			description: props.description,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			afterUnitId: props.afterUnitId ? UnitId.create(props.afterUnitId) : null,
		});
	}

	update(now: Date, props: UpdateProjectProps) {
		this._props.updatedAt = now;

		if (props.name !== undefined) {
			this._props.name = props.name;
		}

		if (props.description !== undefined) {
			this._props.description = props.description;
		}

		if (props.afterUnitId !== undefined) {
			this._props.afterUnitId = props.afterUnitId;
		}
	}

	get id(): ProjectId {
		return this._id;
	}

	get name(): string {
		return this._props.name;
	}

	get description(): string | null {
		return this._props.description;
	}

	get afterUnitId(): UnitId | null {
		return this._props.afterUnitId;
	}

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
}
