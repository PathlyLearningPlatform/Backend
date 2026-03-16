import { IEventHandler } from '@/app/common';
import { IEventBus } from '@/app/common/ports';
import { IUnitProgressReadRepository } from '@/app/unit-progress/interfaces';
import { UUID } from '@/domain/common';
import { LessonCompletedEvent } from '@/domain/lesson-progress';
import {
	IUnitProgressRepository,
	UnitProgressId,
} from '@/domain/unit-progress';

export class OnLessonCompletedHandler
	implements IEventHandler<LessonCompletedEvent>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: LessonCompletedEvent): Promise<void> {
		const unitProgressDto = await this.unitProgressReadRepository.findForUser(
			event.unitId,
			event.userId,
		);

		if (!unitProgressDto) {
			return;
		}

		const unitProgress = await this.unitProgressRepository.load(
			UnitProgressId.create(UUID.create(unitProgressDto.id)),
		);

		if (!unitProgress) {
			return;
		}

		unitProgress.completeLesson(event.occuredAt);

		const events = unitProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
