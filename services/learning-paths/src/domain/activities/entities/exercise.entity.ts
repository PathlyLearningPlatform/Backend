import type { ExerciseDifficulty } from '../enums';
import {
	Activity,
	ActivityCreateFields,
	type ActivityFields,
	type ActivityUpdateFields,
} from './activity.entity';

export interface ExerciseFields extends ActivityFields {
	difficulty: ExerciseDifficulty;
}

export type ExerciseCreateFields = ActivityCreateFields &
	Pick<ExerciseFields, 'difficulty'> &
	Partial<ExerciseFields>;
export type ExerciseUpdateFields = ActivityUpdateFields &
	Partial<Pick<ExerciseFields, 'difficulty'>>;

export class Exercise extends Activity implements ExerciseFields {
	constructor(fields: ExerciseCreateFields) {
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
