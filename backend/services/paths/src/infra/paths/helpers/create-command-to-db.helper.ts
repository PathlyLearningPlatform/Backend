import { CreatePathCommand } from '@/domain/paths/commands';
import { CreatePathOptions } from '../types';

export function createPathCommandToDb(
	command: CreatePathCommand,
): CreatePathOptions {
	return command;
}
