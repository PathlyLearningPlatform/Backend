import { Url } from "../../../common";
import { InvalidUrlException } from "../../../common/exceptions";

describe("Url value object", () => {
	describe("create", () => {
		it("should return Url value object", () => {
			const validUrl = "https://example.com";
			const vo = Url.create(validUrl);

			expect(vo.value).toBe(validUrl);
		});
		it("should throw InvalidUrlException", () => {
			const invalidUrl = "invalid-url";

			expect(() => {
				Url.create(invalidUrl);
			}).toThrow(new InvalidUrlException(invalidUrl));
		});
	});

	describe("equals", () => {
		it("should return true", () => {
			const url1 = Url.create("https://example.com");
			const url2 = Url.create("https://example.com");

			expect(url1.equals(url2)).toBe(true);
			expect(url2.equals(url1)).toBe(true);
		});

		it("should return false", () => {
			const url1 = Url.create("https://example.com");
			const url2 = Url.create("https://example1.com");

			expect(url1.equals(url2)).toBe(false);
			expect(url2.equals(url1)).toBe(false);
		});
	});
});
