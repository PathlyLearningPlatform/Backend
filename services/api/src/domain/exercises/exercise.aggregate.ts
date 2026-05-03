import { AggregateRoot, Url, UUID, RepositoryId } from '@/domain/common';
import { ExerciseDifficulty, ExerciseId } from './value-objects';

type ExerciseProps = {
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	difficulty: ExerciseDifficulty;
	repositoryId: RepositoryId;
	acceptUrl: Url;
};
type CreateExerciseProps = {
	difficulty: ExerciseDifficulty;
	createdAt: Date;
	name: string;
	description?: string;
	repositoryId: RepositoryId;
	acceptUrl: Url;
};

type ExerciseFromDataSourceProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	difficulty: ExerciseDifficulty;
	repositoryId: number;
	acceptUrl: string;
};
type UpdateExerciseProps = Partial<{
	difficulty: ExerciseDifficulty;
	name: string;
	description: string | null;
}>;

export class Exercise extends AggregateRoot<ExerciseId, ExerciseProps> {
	protected readonly _props: ExerciseProps;

	private constructor(id: ExerciseId, props: ExerciseProps) {
		super(id);
		this._props = props;
	}

	static create(id: ExerciseId, props: CreateExerciseProps): Exercise {
		return new Exercise(id, {
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			difficulty: props.difficulty,
			acceptUrl: props.acceptUrl,
			repositoryId: props.repositoryId,
		});
	}

	static fromDataSource(props: ExerciseFromDataSourceProps): Exercise {
		return new Exercise(ExerciseId.create(UUID.create(props.id)), {
			name: props.name,
			description: props.description,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			difficulty: props.difficulty,
			acceptUrl: Url.create(props.acceptUrl),
			repositoryId: RepositoryId.create(props.repositoryId),
		});
	}

	get id(): ExerciseId {
		return this._id;
	}
	get createdAt(): Date {
		return this._props.createdAt;
	}
	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
	get name(): string {
		return this._props.name;
	}
	get description(): string | null {
		return this._props.description;
	}
	get difficulty(): ExerciseDifficulty {
		return this._props.difficulty;
	}
	get repositoryId(): RepositoryId {
		return this._props.repositoryId;
	}
	get acceptUrl(): Url {
		return this._props.acceptUrl;
	}

	update(now: Date, props?: UpdateExerciseProps): void {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.difficulty) {
			this._props.difficulty = props.difficulty;
		}

		this._props.updatedAt = now;
	}
}
