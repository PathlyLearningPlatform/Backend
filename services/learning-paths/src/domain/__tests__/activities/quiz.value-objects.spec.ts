import { QuestionId } from "../../activities/quizzes/value-objects/question-id.vo";
import { UUID } from "../../common/value-objects/uuid.vo";

const makeUuid = (value: string) => UUID.create(value);

describe("Quiz value objects", () => {
	describe("QuestionId", () => {
		it("creates a question ID from a UUID value object", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id = new QuestionId({ value: uuid });

			expect(id.value).toBe("123e4567-e89b-42d3-a456-426614174000");
		});

		it("throws when created with an invalid UUID via static create", () => {
			expect(() => QuestionId.create("not-a-uuid")).toThrow();
		});

		it("equals another QuestionId with the same value", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id1 = new QuestionId({ value: uuid });
			const id2 = new QuestionId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it("does not equal a QuestionId with a different value", () => {
			const id1 = new QuestionId({
				value: makeUuid("123e4567-e89b-42d3-a456-426614174000"),
			});
			const id2 = new QuestionId({
				value: makeUuid("223e4567-e89b-42d3-a456-426614174000"),
			});

			expect(id1.equals(id2)).toBe(false);
		});
	});
});
