import { OnActivityCompletedHandler } from '@/app/activity-progress/events';
import { OnLearningPathCompletedHandler } from '@/app/learning-path-progress/events';
import { OnLessonCompletedHandler } from '@/app/lesson-progress/events';
import { OnSectionCompletedHandler } from '@/app/section-progress/events';
import { OnUnitCompletedHandler } from '@/app/unit-progress/events';
import { DiToken } from '@/infra/common';
import { eventHandlersProvider } from '@/infra/event-handlers.provider';

describe('eventHandlersProvider', () => {
	it('contains all expected handler providers', () => {
		const tokens = eventHandlersProvider.map((provider) =>
			typeof provider === 'object' && 'provide' in provider
				? provider.provide
				: undefined,
		);

		expect(tokens).toEqual(
			expect.arrayContaining([
				DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
				DiToken.ON_LESSON_COMPLETED_HANDLER,
				DiToken.ON_UNIT_COMPLETED_HANDLER,
				DiToken.ON_SECTION_COMPLETED_HANDLER,
				DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
			]),
		);
	});

	it('creates handler instances through factories', () => {
		const activityProvider = eventHandlersProvider.find(
			(provider) =>
				typeof provider === 'object' &&
				'provide' in provider &&
				provider.provide === DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		) as { useFactory: (...args: unknown[]) => unknown };

		const lessonProvider = eventHandlersProvider.find(
			(provider) =>
				typeof provider === 'object' &&
				'provide' in provider &&
				provider.provide === DiToken.ON_LESSON_COMPLETED_HANDLER,
		) as { useFactory: (...args: unknown[]) => unknown };

		const unitProvider = eventHandlersProvider.find(
			(provider) =>
				typeof provider === 'object' &&
				'provide' in provider &&
				provider.provide === DiToken.ON_UNIT_COMPLETED_HANDLER,
		) as { useFactory: (...args: unknown[]) => unknown };

		const sectionProvider = eventHandlersProvider.find(
			(provider) =>
				typeof provider === 'object' &&
				'provide' in provider &&
				provider.provide === DiToken.ON_SECTION_COMPLETED_HANDLER,
		) as { useFactory: (...args: unknown[]) => unknown };

		const lpProvider = eventHandlersProvider.find(
			(provider) =>
				typeof provider === 'object' &&
				'provide' in provider &&
				provider.provide === DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
		) as { useFactory: (...args: unknown[]) => unknown };

		expect(
			activityProvider.useFactory({} as never, {} as never, {} as never),
		).toBeInstanceOf(OnActivityCompletedHandler);
		expect(
			lessonProvider.useFactory({} as never, {} as never, {} as never),
		).toBeInstanceOf(OnLessonCompletedHandler);
		expect(
			unitProvider.useFactory({} as never, {} as never, {} as never),
		).toBeInstanceOf(OnUnitCompletedHandler);
		expect(
			sectionProvider.useFactory({} as never, {} as never, {} as never),
		).toBeInstanceOf(OnSectionCompletedHandler);
		expect(lpProvider.useFactory()).toBeInstanceOf(
			OnLearningPathCompletedHandler,
		);
	});
});
