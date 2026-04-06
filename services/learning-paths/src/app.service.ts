import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { OnActivityCompletedHandler } from '@/app/activities/events';
import type { OnLearningPathCompletedHandler } from '@/app/learning-paths/events';
import type { OnLessonCompletedHandler } from '@/app/lessons/events';
import type { OnSectionCompletedHandler } from '@/app/sections/events';
import type { OnUnitCompletedHandler } from '@/app/units/events';
import type { ActivityCompletedEvent } from '@/domain/activities';
import { Event } from '@/domain/common';
import type { LearningPathCompletedEvent } from '@/domain/learning-paths';
import type { LessonCompletedEvent } from '@/domain/lessons';
import type { SectionCompletedEvent } from '@/domain/sections';
import type { UnitCompletedEvent } from '@/domain/units';
import { DiToken } from '@/infra/common/enums';

@Injectable()
export class AppService implements OnModuleInit {
	constructor(
		@Inject(DiToken.ON_ACTIVITY_COMPLETED_HANDLER)
		private readonly onActivityCompletedHandler: OnActivityCompletedHandler,
		@Inject(DiToken.ON_LESSON_COMPLETED_HANDLER)
		private readonly onLessonCompletedHandler: OnLessonCompletedHandler,
		@Inject(DiToken.ON_UNIT_COMPLETED_HANDLER)
		private readonly onUnitCompletedHandler: OnUnitCompletedHandler,
		@Inject(DiToken.ON_SECTION_COMPLETED_HANDLER)
		private readonly onSectionCompletedHandler: OnSectionCompletedHandler,
		@Inject(DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER)
		private readonly onLearningPathCompletedHandler: OnLearningPathCompletedHandler,
	) {}

	onModuleInit() {}

	@OnEvent(Event.ACTIVITY_COMPLETED)
	async handleActivityCompletedEvent(event: ActivityCompletedEvent) {
		await this.onActivityCompletedHandler.handle(event);
	}

	@OnEvent(Event.LESSON_COMPLETED)
	async handleLessonCompletedEvent(event: LessonCompletedEvent) {
		await this.onLessonCompletedHandler.handle(event);
	}

	@OnEvent(Event.UNIT_COMPLETED)
	async handleUnitCompletedEvent(event: UnitCompletedEvent) {
		await this.onUnitCompletedHandler.handle(event);
	}

	@OnEvent(Event.SECTION_COMPLETED)
	async handleSectionCompletedEvent(event: SectionCompletedEvent) {
		await this.onSectionCompletedHandler.handle(event);
	}

	@OnEvent(Event.LEARNING_PATH_COMPLETED)
	async handleLearningPathCompletedEvent(event: LearningPathCompletedEvent) {
		await this.onLearningPathCompletedHandler.handle(event);
	}
}
