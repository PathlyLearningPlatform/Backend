import { Inject, Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from './domain/common';
import { DiToken } from './infra/common';
import type { OnActivityCompletedHandler } from './app/activity-progress/events';
import type { OnLessonCompletedHandler } from './app/lesson-progress/events';
import type { OnUnitCompletedHandler } from './app/unit-progress/events';
import type { OnSectionCompletedHandler } from './app/section-progress/events';
import type { OnLearningPathCompletedHandler } from './app/learning-path-progress/events';
import type { ActivityCompletedEvent } from './domain/activity-progress';
import type { LessonCompletedEvent } from './domain/lesson-progress';
import type { UnitCompletedEvent } from './domain/unit-progress';
import type { SectionCompletedEvent } from './domain/section-progress';
import type { LearningPathCompletedEvent } from './domain/learning-path-progress';

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
