import type { CreatePathCommand } from '@/domain/paths/commands';
import type { CreatePathOptions } from '../types';

export function createPathCommandToDb(
	command: CreatePathCommand,
): CreatePathOptions {
	return command;
}
