import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import { ExceptionMessage } from '../enums/exception-message.enum'

export const exceptionCodeToMessage = {
	[LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND]:
		ExceptionMessage.LEARNING_PATH_NOT_FOUND,
	[LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED]:
		ExceptionMessage.LEARNING_PATH_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.SECTION_NOT_FOUND]:
		ExceptionMessage.SECTION_NOT_FOUND,
	[LearningPathsApiErrorCodes.SECTION_CANNOT_BE_REMOVED]:
		ExceptionMessage.SECTION_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.SECTION_DUPLICATE_ORDER]:
		ExceptionMessage.SECTION_DUPLICATE_ORDER,
	[LearningPathsApiErrorCodes.UNIT_NOT_FOUND]: ExceptionMessage.UNIT_NOT_FOUND,
	[LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED]:
		ExceptionMessage.UNIT_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.UNIT_DUPLICATE_ORDER]:
		ExceptionMessage.UNIT_DUPLICATE_ORDER,
	[LearningPathsApiErrorCodes.LESSON_NOT_FOUND]:
		ExceptionMessage.LESSON_NOT_FOUND,
	[LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED]:
		ExceptionMessage.LESSON_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.LESSON_DUPLICATE_ORDER]:
		ExceptionMessage.LESSON_DUPLICATE_ORDER,
	[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND]:
		ExceptionMessage.ACTIVITY_NOT_FOUND,
	[LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER]:
		ExceptionMessage.ACTIVITY_DUPLICATE_ORDER,
	[LearningPathsApiErrorCodes.INTERNAL_ERROR]: ExceptionMessage.INTERNAL_ERROR,
}
