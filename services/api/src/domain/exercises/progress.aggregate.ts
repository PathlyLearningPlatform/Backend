import { AggregateRoot, Url, UserId, UUID, RepositoryId } from '../common';
import {
	ExerciseId,
	ExerciseProgressId,
	ExerciseStatus,
} from './value-objects';

export type ExerciseProgressProps = {
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ExerciseStatus;
	repositoryUrl: Url;
	repositoryId: RepositoryId;
};
export type CreateExerciseProgressProps = {
	repositoryUrl: Url;
	repositoryId: RepositoryId;
};
export type ExerciseProgressFromDataSourceProps = {
	exerciseId: string;
	userId: string;
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ExerciseStatus;
	repositoryUrl: string;
	repositoryId: number;
};

export class ExerciseProgress extends AggregateRoot<
	ExerciseProgressId,
	ExerciseProgressProps
> {
	private _props: ExerciseProgressProps;

	private constructor(id: ExerciseProgressId, props: ExerciseProgressProps) {
		super(id);
		this._props = props;
	}

	static create(
		id: ExerciseProgressId,
		props: CreateExerciseProgressProps,
	): ExerciseProgress {
		return new ExerciseProgress(id, {
			completedAt: null,
			status: ExerciseStatus.IN_PROGRESS,
			updatedAt: null,
			repositoryUrl: props.repositoryUrl,
			repositoryId: props.repositoryId,
		});
	}

	static fromDataSource(
		props: ExerciseProgressFromDataSourceProps,
	): ExerciseProgress {
		return new ExerciseProgress(
			ExerciseProgressId.create(
				ExerciseId.create(UUID.create(props.exerciseId)),
				UserId.create(UUID.create(props.userId)),
			),
			{
				completedAt: props.completedAt,
				status: props.status,
				updatedAt: props.updatedAt,
				repositoryUrl: Url.create(props.repositoryUrl),
				repositoryId: RepositoryId.create(props.repositoryId),
			},
		);
	}

	complete(now: Date) {
		this._props.completedAt = now;
		this._props.status = ExerciseStatus.COMPLETED;
		this._props.updatedAt = now;
	}

	get exerciseId(): ExerciseId {
		return this._id.exerciseId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get status(): ExerciseStatus {
		return this._props.status;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get repositoryUrl(): Url {
		return this._props.repositoryUrl;
	}

	get repositoryId(): RepositoryId {
		return this._props.repositoryId;
	}
}
