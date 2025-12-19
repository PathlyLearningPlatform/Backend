import type { UpdateSectionComand } from '@/domain/sections/commands';
import type { UpdateSectionOptions } from '../types';

export function updateSectionCommandToDb(
	command: UpdateSectionComand,
): UpdateSectionOptions {
	return command;
}
