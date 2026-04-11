import { Order } from "@/domain/common";
import { LessonId } from "@/domain/lessons/value-objects";
import {
	Activity,
	type ActivityFromDataSourceProps,
	type ActivityProps,
	type CreateActivityProps,
	type UpdateActivityProps,
} from "../activity.aggregate";
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from "../value-objects";
import type { ExerciseDifficulty } from "./value-objects";

type ExerciseProps = ActivityProps & {
	difficulty: ExerciseDifficulty;
};
type CreateExerciseProps = Omit<
	CreateActivityProps & {
		difficulty: ExerciseDifficulty;
	},
	"type"
>;
type ExerciseFromDataSourceProps = Omit<
	ActivityFromDataSourceProps & {
		difficulty: ExerciseDifficulty;
	},
	"type"
>;
type UpdateExerciseProps = UpdateActivityProps &
	Partial<{
		difficulty: ExerciseDifficulty;
	}>;

export class Exercise extends Activity {
	protected readonly _props: ExerciseProps;

	private constructor(id: ActivityId, props: ExerciseProps) {
		super(id, props);
		this._props = props;
	}

	static create(id: ActivityId, props: CreateExerciseProps): Exercise {
		return new Exercise(id, {
			lessonId: props.lessonId,
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			order: props.order,
			type: ActivityType.EXERCISE,
			difficulty: props.difficulty,
		});
	}

	static fromDataSource(props: ExerciseFromDataSourceProps): Exercise {
		return new Exercise(ActivityId.create(props.id), {
			lessonId: LessonId.create(props.lessonId),
			name: ActivityName.create(props.name),
			description: props.description
				? ActivityDescription.create(props.description)
				: null,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			order: Order.create(props.order),
			type: ActivityType.EXERCISE,
			difficulty: props.difficulty,
		});
	}

	get difficulty(): ExerciseDifficulty {
		return this._props.difficulty;
	}

	update(now: Date, props?: UpdateExerciseProps): void {
		super.update(now, props);

		if (props?.difficulty) {
			this._props.difficulty = props.difficulty;
		}
	}
}
