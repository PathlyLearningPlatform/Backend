import { Module, type DynamicModule } from '@nestjs/common';
import { AppLogger } from './logger.service';
import type { AppLoggerModuleOptions } from './config.type';

@Module({
	providers: [AppLogger],
	exports: [AppLogger],
})
export class AppLoggerModule {
	static register(options: AppLoggerModuleOptions): DynamicModule {
		return {
			module: AppLoggerModule,
			providers: [AppLogger],
			exports: [AppLogger],
			global: options.isGlobal ?? false,
		};
	}
}
