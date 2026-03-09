import type { Provider } from '@nestjs/common';
import { DbService } from '@/infra/common/db/db.service';
import { mockedDrizzle } from './drizzle.mock';

export const mockedDbService: Provider = {
	provide: DbService,
	useValue: {
		getDb: jest.fn().mockReturnValue(mockedDrizzle),
	},
};
