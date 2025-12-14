import type { UpdatePathComand } from '@/domain/paths/commands';
import type { UpdatePathOptions } from '../types';

export function updatePathCommandToDb(
	command: UpdatePathComand,
): UpdatePathOptions {
	return command;
}
