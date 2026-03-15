import { IEventHandler } from '@/app/common';
import { IEventBus } from '@/app/common/interfaces';
import { ISectionProgressReadRepository } from '@/app/section-progress/interfaces';
import { UnitCompletedEvent } from '@/domain/unit-progress';

export class OnUnitCompletedHandler
	implements IEventHandler<UnitCompletedEvent>
{
	constructor(
		private readonly sectionProgressRepository,
		private readonly sectionProgressReadRepository: ISectionProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: UnitCompletedEvent): Promise<void> {}
}
