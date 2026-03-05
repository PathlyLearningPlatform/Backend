import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigException } from '@pathly-backend/common/index.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DiToken } from '../../enums';
import type { Config } from '../../types';
import { DbService } from './db.service';
import * as schema from './schemas';

@Module({
	providers: [
		{
			provide: DiToken.PG_POOL,
			useFactory: (configService: ConfigService) => {
				const dbConfig = configService.get<Config['db']>('db');

				if (!dbConfig) {
					throw new ConfigException('failed to load database config');
				}

				const pool = new Pool({
					host: dbConfig.host,
					user: dbConfig.user,
					password: dbConfig.password,
					port: dbConfig.port,
					database: dbConfig.name,
				});

				return pool;
			},
			inject: [ConfigService],
		},
		{
			provide: DiToken.DRIZZLE,
			useFactory(pool: Pool) {
				return drizzle({ client: pool, schema: schema });
			},
			inject: [DiToken.PG_POOL],
		},
		DbService,
	],
	exports: [DiToken.DRIZZLE, DbService],
})
export class DbModule {}
