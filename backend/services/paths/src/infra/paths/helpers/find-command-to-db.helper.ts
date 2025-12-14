import type { FindPathsCommand } from '@/domain/paths/commands';
import type { FindPathsOptions } from '../types';

export function findPathsCommandToDb(
	command: FindPathsCommand,
): FindPathsOptions {
	return command;
}
