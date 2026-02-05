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
	[LearningPathsApiErrorCodes.UNIT_NOT_FOUND]: ExceptionMessage.UNIT_NOT_FOUND,
	[LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED]:
		ExceptionMessage.UNIT_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.LESSON_NOT_FOUND]:
		ExceptionMessage.LESSON_NOT_FOUND,
	[LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED]:
		ExceptionMessage.LESSON_CANNOT_BE_REMOVED,
	[LearningPathsApiErrorCodes.INTERNAL_ERROR]: ExceptionMessage.INTERNAL_ERROR,
}
