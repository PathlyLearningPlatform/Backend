import type { ExerciseDifficulty } from '../enums';
import {
	Activity,
	type ActivityAllowedCreateProps,
	type ActivityProps,
	type ActivityRequiredCreateProps,
	type ActivityUpdateProps,
} from './activity.entity';

export interface ExerciseProps extends ActivityProps {
	difficulty: ExerciseDifficulty;
}

export type ExerciseRequiredCreateProps = Pick<ExerciseProps, 'difficulty'> &
	ActivityRequiredCreateProps;
export type ExerciseAllowedCreateProps = ActivityAllowedCreateProps;
export type ExerciseCreateProps = ExerciseRequiredCreateProps &
	ExerciseAllowedCreateProps;
export type ExerciseUpdateProps = ActivityUpdateProps &
	Partial<Pick<ExerciseProps, 'difficulty'>>;

export class Exercise extends Activity implements ExerciseProps {
	constructor(props: ExerciseProps) {
		super(props);

		this.difficulty = props.difficulty;
	}

	update(props: ExerciseUpdateProps) {
		super.update(props);

		if (props.difficulty) {
			this.difficulty = props.difficulty;
		}
	}

	difficulty: ExerciseDifficulty;
}
