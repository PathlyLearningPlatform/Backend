import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { PostgresProgressRepository } from './postgres.repository';

@Module({
	imports: [DbModule, AuthModule],
	controllers: [ProgressController],
	providers: [PostgresProgressRepository],
})
export class ProgressModule {}
