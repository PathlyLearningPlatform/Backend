import type { IEventBus, IEventHandler } from "@/app/common";
import type { ISectionProgressReadRepository } from "@/app/sections/interfaces";
import { UserId, UUID } from "@/domain/common";
import {
	type ISectionProgressRepository,
	SectionId,
	SectionProgressId,
} from "@/domain/sections";
import type { UnitCompletedEvent } from "@/domain/units";

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
			await this.sectionProgressReadRepository.findOneForUser(
				event.sectionId,
				event.userId,
			);

		if (!sectionProgressDto) {
			return;
		}

		const sectionProgress = await this.sectionProgressRepository.load(
			SectionProgressId.create(
				SectionId.create(event.sectionId),
				UserId.create(UUID.create(event.userId)),
			),
		);

		if (!sectionProgress) {
			return;
		}

		sectionProgress.completeUnit(event.occuredAt);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
