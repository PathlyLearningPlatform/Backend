export const mockedDrizzle = {
	select: jest.fn().mockReturnThis(),
	from: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	limit: jest.fn().mockReturnThis(),
	offset: jest.fn().mockReturnThis(),
	orderBy: jest.fn().mockReturnThis(),
	innerJoin: jest.fn().mockReturnThis(),
	leftJoin: jest.fn().mockReturnThis(),
	insert: jest.fn().mockReturnThis(),
	values: jest.fn().mockReturnThis(),
	onConflictDoUpdate: jest.fn().mockReturnThis(),
	onConflictDoNothing: jest.fn().mockReturnThis(),
	returning: jest.fn().mockReturnThis(),
	update: jest.fn().mockReturnThis(),
	set: jest.fn().mockReturnThis(),
	delete: jest.fn().mockReturnThis(),
	transaction: jest.fn(),
};

mockedDrizzle.transaction.mockImplementation((cb: any) => cb(mockedDrizzle));

export function resetDrizzleMocks(): void {
	for (const key of Object.keys(mockedDrizzle) as Array<
		keyof typeof mockedDrizzle
	>) {
		(mockedDrizzle[key] as jest.Mock).mockReset();
		if (key === "transaction") {
			mockedDrizzle.transaction.mockImplementation((cb: any) =>
				cb(mockedDrizzle),
			);
		} else {
			(mockedDrizzle[key] as jest.Mock).mockReturnThis();
		}
	}
}
