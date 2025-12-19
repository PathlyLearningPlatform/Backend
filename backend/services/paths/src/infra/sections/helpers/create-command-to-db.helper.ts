import type { CreateSectionCommand } from '@/domain/sections/commands';
import type { CreateSectionOptions } from '../types';

export function createSectionCommandToDb(
	command: CreateSectionCommand,
): CreateSectionOptions {
	return command;
}
