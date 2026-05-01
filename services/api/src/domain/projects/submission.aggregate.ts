import { AggregateRoot, UserId, UUID } from '../common';
import { ProjectId, ProjectSubmissionId } from './value-objects';
import { ProjectSubmissionStatus } from './value-objects/submission-status.vo';

export type ProjectSubmissionProps = {
	projectId: ProjectId;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ProjectSubmissionStatus;
	userId: UserId;
	commitSha: string;
};
export type CreateProjectSubmission = {
	projectId: ProjectId;
	submittedAt: Date;
	userId: UserId;
	commitSha: string;
};
export type ProjectSubmissionFromDataSource = {
	id: string;
	projectId: string;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ProjectSubmissionStatus;
	userId: string;
	commitSha: string;
};

export class ProjectSubmission extends AggregateRoot<
	ProjectSubmissionId,
	ProjectSubmission
> {
	private _props: ProjectSubmissionProps;

	private constructor(id: ProjectSubmissionId, props: ProjectSubmissionProps) {
		super(id);
		this._props = props;
	}

	static create(
		id: ProjectSubmissionId,
		props: CreateProjectSubmission,
	): ProjectSubmission {
		return new ProjectSubmission(id, {
			projectId: props.projectId,
			status: ProjectSubmissionStatus.PENDING,
			submittedAt: props.submittedAt,
			updatedAt: null,
			userId: props.userId,
			commitSha: props.commitSha,
		});
	}

	static fromDataSource(
		props: ProjectSubmissionFromDataSource,
	): ProjectSubmission {
		return new ProjectSubmission(
			ProjectSubmissionId.create(UUID.create(props.id)),
			{
				projectId: ProjectId.create(UUID.create(props.projectId)),
				status: props.status,
				submittedAt: props.submittedAt,
				updatedAt: props.updatedAt,
				userId: UserId.create(UUID.create(props.userId)),
				commitSha: props.commitSha,
			},
		);
	}

	update(now: Date) {
		this._props.updatedAt = now;
	}

	changeStatus(now: Date, newStatus: ProjectSubmissionStatus) {
		this.update(now);

		this._props.status = newStatus;
	}

	get id(): ProjectSubmissionId {
		return this._id;
	}

	get projectId(): ProjectId {
		return this._props.projectId;
	}

	get submittedAt(): Date {
		return this._props.submittedAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get status(): ProjectSubmissionStatus {
		return this._props.status;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	get commitSha(): string {
		return this._props.commitSha;
	}
}
