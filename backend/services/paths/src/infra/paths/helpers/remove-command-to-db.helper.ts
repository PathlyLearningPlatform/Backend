import { RemovePathCommand } from '@/domain/paths/commands';
import { RemovePathOptions } from '../types';

export function removePathCommandToDb(
	command: RemovePathCommand,
): RemovePathOptions {
	return command;
}
