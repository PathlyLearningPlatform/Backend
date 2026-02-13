export enum ExceptionMessage {
	LEARNING_PATH_NOT_FOUND = 'Learning path was not found.',
	LEARNING_PATH_CANNOT_BE_REMOVED = 'Learning path cannot be removed.',

	SECTION_NOT_FOUND = 'Section was not found.',
	SECTION_CANNOT_BE_REMOVED = 'Section cannot be removed.',
	SECTION_DUPLICATE_ORDER = 'Section with that order and learning path id already exists. Try different order or reorder existing sections.',

	UNIT_NOT_FOUND = 'Unit was not found.',
	UNIT_CANNOT_BE_REMOVED = 'Unit cannot be removed.',

	LESSON_NOT_FOUND = 'Lesson was not found.',
	LESSON_CANNOT_BE_REMOVED = 'Lesson cannot be removed.',

	ACTIVITY_NOT_FOUND = 'Activity was not found.',

	INTERNAL_ERROR = 'Internal error. Please try again later.',
}
