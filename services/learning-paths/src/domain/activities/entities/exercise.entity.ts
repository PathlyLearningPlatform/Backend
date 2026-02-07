import type { ExerciseDifficulty } from '../enums';
import {
	Activity,
	type ActivityAllowedCreateFields,
	type ActivityFields,
	type ActivityRequiredCreateFields,
	type ActivityUpdateFields,
} from './activity.entity';

export interface ExerciseFields extends ActivityFields {
	difficulty: ExerciseDifficulty;
}

export type ExerciseRequiredCreateFields = Pick<ExerciseFields, 'difficulty'> &
	ActivityRequiredCreateFields;
export type ExerciseAllowedCreateFields = ActivityAllowedCreateFields;
export type ExerciseCreateFields = ExerciseRequiredCreateFields &
	ExerciseAllowedCreateFields;
export type ExerciseUpdateFields = ActivityUpdateFields &
	Partial<Pick<ExerciseFields, 'difficulty'>>;

export class Exercise extends Activity implements ExerciseFields {
	constructor(fields: ExerciseFields) {
		super(fields);

		this.difficulty = fields.difficulty;
	}

	update(fields: ExerciseUpdateFields) {
		super.update(fields);

		if (fields.difficulty !== undefined) {
			this.difficulty = fields.difficulty;
		}
	}

	difficulty: ExerciseDifficulty;
}
