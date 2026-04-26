import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class OctokitModule {
	static register(): DynamicModule {
		return {
			module: OctokitModule,
			providers: [],
			exports: [],
		};
	}
}
