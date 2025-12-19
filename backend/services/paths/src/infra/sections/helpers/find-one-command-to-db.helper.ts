import type { FindOneSectionCommand } from '@/domain/sections/commands';
import type { FindOneSectionOptions } from '../types';

export function findOneSectionCommandToDb(
	command: FindOneSectionCommand,
): FindOneSectionOptions {
	return command;
}
