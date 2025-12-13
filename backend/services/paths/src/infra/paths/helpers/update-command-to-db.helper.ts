import { UpdatePathComand } from '@/domain/paths/commands';
import { UpdatePathOptions } from '../types';

export function updatePathCommandToDb(
	command: UpdatePathComand,
): UpdatePathOptions {
	return command;
}
