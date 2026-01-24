import { ExerciseDifficulty } from '../enums';

export interface IExercise {
	difficulty: ExerciseDifficulty;
	activityId: string;
}

export type ExerciseRequiredCreateFields = Pick<
	IExercise,
	'difficulty' | 'activityId'
>;
// export type ExerciseAllowedCreateFields = {};
export type ExerciseCreateFields =
	ExerciseRequiredCreateFields /* & ExerciseAllowedCreateFields */;

export type ExerciseUpdateFields = Partial<Omit<IExercise, 'activityId'>>;

export class Exercise implements IExercise {
	constructor(fields: IExercise) {
		this.activityId = fields.activityId;
		this.difficulty = fields.difficulty;
	}

	update(fields: ExerciseUpdateFields) {
		if (fields.difficulty) {
			this.difficulty = fields.difficulty;
		}
	}

	difficulty: ExerciseDifficulty;
	activityId: string;
}
