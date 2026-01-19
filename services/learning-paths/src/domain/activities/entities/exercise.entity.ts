import { ExerciseDifficulty } from '../enums';
import { Activity } from './activity.entity';

export class Exercise extends Activity {
	difficulty: ExerciseDifficulty;
}
