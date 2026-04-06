import { type UserId, UUID, ValueObject } from "@/domain/common";
import type { LearningPathId } from "./id.vo";

type Props = {
	learningPathId: LearningPathId;
	userId: UserId;
};

export class LearningPathProgressId extends ValueObject<Props> {
	private readonly _brand: "learningPathProgressId" = "learningPathProgressId";

	get userId(): UserId {
		return this._props.userId;
	}

	get learningPathId(): LearningPathId {
		return this._props.learningPathId;
	}

	static create(
		learningPathId: LearningPathId,
		userId: UserId,
	): LearningPathProgressId {
		return new LearningPathProgressId({ learningPathId, userId });
	}
}
