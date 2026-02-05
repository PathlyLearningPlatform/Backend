import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import {
	SectionCannotBeRemovedException,
	SectionNotFoundException,
} from '@/domain/sections/exceptions';

export class RemoveSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	async execute(id: string): Promise<void> {
		try {
			const wasRemoved = await this.sectionsRepository.remove(id);

			if (!wasRemoved) {
				throw new SectionNotFoundException(id);
			}
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new SectionCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
