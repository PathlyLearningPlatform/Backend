import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js'
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
	[LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND]:
		ExceptionMessage.ACTIVITY_NOT_FOUND,
	[LearningPathsApiErrorCodes.INTERNAL_ERROR]: ExceptionMessage.INTERNAL_ERROR,
	[SkillsApiErrorCodes.SKILL_NOT_FOUND]: ExceptionMessage.SKILL_NOT_FOUND,
	[SkillsApiErrorCodes.SKILL_CANNOT_REFERENCE_ITSELF]:
		ExceptionMessage.SKILL_CANNOT_REFERENCE_ITSELF,
	[SkillsApiErrorCodes.ROOT_SKILL_PARENT]: ExceptionMessage.ROOT_SKILL_PARENT,
	[SkillsApiErrorCodes.VALIDATION_ERROR]: ExceptionMessage.VALIDATION_ERROR,
	[SkillsApiErrorCodes.SKILL_PROGRESS_NOT_FOUND]:
		ExceptionMessage.SKILL_PROGRESS_NOT_FOUND,
	[SkillsApiErrorCodes.INTERNAL_ERROR]: ExceptionMessage.INTERNAL_ERROR,
}
