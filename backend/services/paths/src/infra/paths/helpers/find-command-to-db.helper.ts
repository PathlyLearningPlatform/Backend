import { FindPathsCommand } from '@/domain/paths/commands';
import { FindPathsOptions } from '../types';

export function findPathsCommandToDb(
	command: FindPathsCommand,
): FindPathsOptions {
	return command;
}
