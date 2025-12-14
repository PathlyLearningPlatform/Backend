import type { RemovePathCommand } from '@/domain/paths/commands';
import type { RemovePathOptions } from '../types';

export function removePathCommandToDb(
	command: RemovePathCommand,
): RemovePathOptions {
	return command;
}
