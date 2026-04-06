import { UUID } from "../../../common";
import { InvalidUUIDException } from "../../../common/exceptions";

describe("UUID value object", () => {
	describe("create", () => {
		it("should return UUID value object", () => {
			const validUUID = "a1c0bde6-c91b-4bda-8128-a28a30f04e76";
			const vo = UUID.create(validUUID);

			expect(vo.value).toBe(validUUID);
		});
		it("should throw InvalidUUIDException", () => {
			const invalidUUID = "invalid-uuid";

			expect(() => {
				UUID.create(invalidUUID);
			}).toThrow(new InvalidUUIDException(invalidUUID));
		});
	});

	describe("equals", () => {
		it("should return true", () => {
			const uuid1 = UUID.create("a1c0bde6-c91b-4bda-8128-a28a30f04e76");
			const uuid2 = UUID.create("a1c0bde6-c91b-4bda-8128-a28a30f04e76");

			expect(uuid1.equals(uuid2)).toBe(true);
			expect(uuid2.equals(uuid1)).toBe(true);
		});

		it("should return false", () => {
			const uuid1 = UUID.create("a1c0bde6-c91b-4bda-8128-a28a30f04e76");
			const uuid2 = UUID.create("a1c0bde6-c91b-4bda-8128-a28a30f04e75");

			expect(uuid1.equals(uuid2)).toBe(false);
			expect(uuid2.equals(uuid1)).toBe(false);
		});
	});
});
