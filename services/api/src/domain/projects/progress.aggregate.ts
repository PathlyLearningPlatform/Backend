import { AggregateRoot, UserId, UUID } from '../common';
import { ProjectId, ProjectProgressId, ProjectStatus } from './value-objects';

export type ProjectProgressProps = {
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ProjectStatus;
};
export type CreateProjectProgressProps = {};
export type ProjectProgressFromDataSourceProps = {
	projectId: string;
	userId: string;
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ProjectStatus;
};

export class ProjectProgress extends AggregateRoot<
	ProjectProgressId,
	ProjectProgressProps
> {
	private _props: ProjectProgressProps;

	private constructor(id: ProjectProgressId, props: ProjectProgressProps) {
		super(id);
		this._props = props;
	}

	static create(id: ProjectProgressId): ProjectProgress {
		return new ProjectProgress(id, {
			completedAt: null,
			status: ProjectStatus.IN_PROGRESS,
			updatedAt: null,
		});
	}

	static fromDataSource(
		props: ProjectProgressFromDataSourceProps,
	): ProjectProgress {
		return new ProjectProgress(
			ProjectProgressId.create(
				ProjectId.create(UUID.create(props.projectId)),
				UserId.create(UUID.create(props.userId)),
			),
			{
				completedAt: props.completedAt,
				status: props.status,
				updatedAt: props.updatedAt,
			},
		);
	}

	complete(now: Date) {
		this._props.completedAt = now;
		this._props.status = ProjectStatus.COMPLETED;
		this._props.updatedAt = now;
	}

	get projectId(): ProjectId {
		return this._id.projectId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get status(): ProjectStatus {
		return this._props.status;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
}
