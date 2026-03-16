import { IEventHandler } from '@/app/common';
import { IEventBus } from '@/app/common/ports';
import { ISectionProgressReadRepository } from '@/app/section-progress/interfaces';
import { UUID } from '@/domain/common';
import {
	ISectionProgressRepository,
	SectionProgressId,
} from '@/domain/section-progress';
import { UnitCompletedEvent } from '@/domain/unit-progress';

export class OnUnitCompletedHandler
	implements IEventHandler<UnitCompletedEvent>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly sectionProgressReadRepository: ISectionProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: UnitCompletedEvent): Promise<void> {
		const sectionProgressDto =
			await this.sectionProgressReadRepository.findForUser(
				event.sectionId,
				event.userId,
			);

		if (!sectionProgressDto) {
			return;
		}

		const sectionProgress = await this.sectionProgressRepository.load(
			SectionProgressId.create(UUID.create(sectionProgressDto.id)),
		);

		if (!sectionProgress) {
			return;
		}

		sectionProgress.completeUnit(event.occuredAt);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
