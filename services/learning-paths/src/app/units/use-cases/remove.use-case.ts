import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import type { IUnitsRepository } from '@/app/units/interfaces';
import {
	UnitCannotBeRemovedException,
	UnitNotFoundException,
} from '@/domain/units/exceptions';

export class RemoveUnitUseCase {
	constructor(private readonly unitsRepository: IUnitsRepository) {}

	async execute(id: string): Promise<void> {
		try {
			const wasRemoved = await this.unitsRepository.remove(id);

			if (!wasRemoved) {
				throw new UnitNotFoundException(id);
			}
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new UnitCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
