import { ActivityType as ClientActivityType } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { ActivityType } from '../enums'

export function clientActivityTypeToResponse(
	client: ClientActivityType,
): ActivityType {
	switch (client) {
		case ClientActivityType.EXERCISE:
			return ActivityType.EXERCISE
		case ClientActivityType.ARTICLE:
			return ActivityType.ARTICLE
		case ClientActivityType.QUIZ:
			return ActivityType.QUIZ
	}
}
