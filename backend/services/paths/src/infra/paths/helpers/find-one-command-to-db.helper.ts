import type { FindOnePathCommand } from '@/domain/paths/commands';
import type { FindOnePathOptions } from '../types';

export function findOnePathCommandToDb(
	command: FindOnePathCommand,
): FindOnePathOptions {
	return command;
}
