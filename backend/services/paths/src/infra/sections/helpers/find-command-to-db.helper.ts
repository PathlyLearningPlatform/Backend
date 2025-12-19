import type { FindSectionsCommand } from '@/domain/sections/commands';
import type { FindSectionsOptions } from '../types';

export function findSectionsCommandToDb(
	command: FindSectionsCommand,
): FindSectionsOptions {
	return command;
}
