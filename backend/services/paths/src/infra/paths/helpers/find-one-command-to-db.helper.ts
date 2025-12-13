import { FindOnePathCommand } from '@/domain/paths/commands';
import { FindOnePathOptions } from '../types';

export function findOnePathCommandToDb(
	command: FindOnePathCommand,
): FindOnePathOptions {
	return command;
}
