import type { RemoveSectionCommand } from '@/domain/sections/commands';
import type { RemoveSectionOptions } from '../types';

export function removeSectionCommandToDb(
	command: RemoveSectionCommand,
): RemoveSectionOptions {
	return command;
}
