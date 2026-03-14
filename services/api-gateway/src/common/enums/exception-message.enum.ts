export enum ExceptionMessage {
	LEARNING_PATH_NOT_FOUND = 'Learning path was not found.',
	LEARNING_PATH_CANNOT_BE_REMOVED = 'Learning path cannot be removed.',

	SECTION_NOT_FOUND = 'Section was not found.',
	SECTION_CANNOT_BE_REMOVED = 'Section cannot be removed.',
	SECTION_DUPLICATE_ORDER = 'Section with that order and learning path id already exists. Try different order or reorder existing sections.',

	UNIT_NOT_FOUND = 'Unit was not found.',
	UNIT_CANNOT_BE_REMOVED = 'Unit cannot be removed.',
	UNIT_DUPLICATE_ORDER = 'Unit with that order and section id already exists. Try different order or reorder existing units.',

	LESSON_NOT_FOUND = 'Lesson was not found.',
	LESSON_CANNOT_BE_REMOVED = 'Lesson cannot be removed.',
	LESSON_DUPLICATE_ORDER = 'Lesson with that order and unit id already exists. Try different order or reorder existing lessons.',

	ACTIVITY_NOT_FOUND = 'Activity was not found.',
	ACTIVITY_DUPLICATE_ORDER = 'Activity with that order and lesson id already exists. Try different order or reorder existing activities.',

	INTERNAL_ERROR = 'Internal error. Please try again later.',

	ACTIVITY_PROGRESS_NOT_FOUND = 'Progress entry for that activity was not found.',
	ACTIVITY_ALREADY_COMPLETED = 'Activity which has been completed cannot be started again',
	LESSON_PROGRESS_NOT_FOUND = 'Progress entry for that lesson was not found.',
	LESSON_ALREADY_COMPLETED = 'Lesson which has been completed cannot be started again',
}
