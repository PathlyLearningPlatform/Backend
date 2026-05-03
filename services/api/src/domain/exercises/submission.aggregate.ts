import { AggregateRoot, UserId, UUID } from '../common';
import {
	ExerciseId,
	ExerciseSubmissionConclusion,
	ExerciseSubmissionId,
} from './value-objects';
import { ExerciseSubmissionStatus } from './value-objects/submission-status.vo';

export type ExerciseSubmissionProps = {
	exerciseId: ExerciseId;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ExerciseSubmissionStatus;
	conclusion: ExerciseSubmissionConclusion | null;
	userId: UserId;
	commitSha: string;
};
export type CreateExerciseSubmission = {
	exerciseId: ExerciseId;
	submittedAt: Date;
	userId: UserId;
	commitSha: string;
};
export type ExerciseSubmissionFromDataSource = {
	id: string;
	exerciseId: string;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ExerciseSubmissionStatus;
	userId: string;
	commitSha: string;
	conclusion: ExerciseSubmissionConclusion | null;
};
export type UpdateExerciseSubmissionProps = Partial<{
	status: ExerciseSubmissionStatus;
	conclusion: ExerciseSubmissionConclusion;
}>;

export class ExerciseSubmission extends AggregateRoot<
	ExerciseSubmissionId,
	ExerciseSubmission
> {
	private _props: ExerciseSubmissionProps;

	private constructor(
		id: ExerciseSubmissionId,
		props: ExerciseSubmissionProps,
	) {
		super(id);
		this._props = props;
	}

	static create(
		id: ExerciseSubmissionId,
		props: CreateExerciseSubmission,
	): ExerciseSubmission {
		return new ExerciseSubmission(id, {
			exerciseId: props.exerciseId,
			status: ExerciseSubmissionStatus.PENDING,
			submittedAt: props.submittedAt,
			updatedAt: null,
			conclusion: null,
			userId: props.userId,
			commitSha: props.commitSha,
		});
	}

	static fromDataSource(
		props: ExerciseSubmissionFromDataSource,
	): ExerciseSubmission {
		return new ExerciseSubmission(
			ExerciseSubmissionId.create(UUID.create(props.id)),
			{
				exerciseId: ExerciseId.create(UUID.create(props.exerciseId)),
				status: props.status,
				submittedAt: props.submittedAt,
				updatedAt: props.updatedAt,
				userId: UserId.create(UUID.create(props.userId)),
				commitSha: props.commitSha,
				conclusion: props.conclusion,
			},
		);
	}

	update(now: Date, props: UpdateExerciseSubmissionProps) {
		this._props.updatedAt = now;

		if (props.status) {
			this._props.status = props.status;
		}

		if (props.conclusion) {
			if (this._props.status === ExerciseSubmissionStatus.COMPLETED) {
				this._props.conclusion = props.conclusion;
			}
		}
	}

	get id(): ExerciseSubmissionId {
		return this._id;
	}

	get exerciseId(): ExerciseId {
		return this._props.exerciseId;
	}

	get submittedAt(): Date {
		return this._props.submittedAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get status(): ExerciseSubmissionStatus {
		return this._props.status;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	get commitSha(): string {
		return this._props.commitSha;
	}

	get conclusion(): ExerciseSubmissionConclusion | null {
		return this._props.conclusion;
	}
}
