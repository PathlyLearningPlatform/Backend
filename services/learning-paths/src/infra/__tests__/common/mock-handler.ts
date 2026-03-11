export type MockHandler = { execute: jest.Mock };

export function mockHandler(): MockHandler {
	return { execute: jest.fn() };
}
