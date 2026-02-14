import { ActivityType as ClientActivityType } from '@pathly-backend/contracts/learning-paths/v1/activities.js'
import { ActivityType } from '../enums'

export function activityTypeToClient(
	activityType: ActivityType,
): ClientActivityType {
	switch (activityType) {
		case ActivityType.EXERCISE:
			return ClientActivityType.EXERCISE
		case ActivityType.ARTICLE:
			return ClientActivityType.ARTICLE
		case ActivityType.QUIZ:
			return ClientActivityType.QUIZ
	}
}
