import { AggregateRoot, Url, UUID } from '../common';
import { ProjectId } from './value-objects';

export type ProjectProps = {
	name: string;
	description: string | null;
	acceptUrl: Url;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateProjectProps = {
	name: string;
	acceptUrl: Url;
	description?: string;
	createdAt: Date;
};

export type ProjectFromDataSourceProps = {
	id: string;
	name: string;
	acceptUrl: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type UpdateProjectProps = Partial<{
	name: string;
	description: string | null;
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
			acceptUrl: props.acceptUrl,
		});
	}

	static fromDataSource(props: ProjectFromDataSourceProps): Project {
		return new Project(ProjectId.create(UUID.create(props.id)), {
			name: props.name,
			description: props.description,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			acceptUrl: Url.create(props.acceptUrl),
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

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get acceptUrl(): Url {
		return this._props.acceptUrl;
	}
}
