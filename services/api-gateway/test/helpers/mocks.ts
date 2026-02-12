import { ConfigService } from '@nestjs/config'
import { parseIntOrReturn } from '@pathly-backend/common/index.js'

export const mockedConfigService = new ConfigService({
	app: {
		port: parseIntOrReturn(process.env.PORT),
		hostname: process.env.HOSTNAME,
		learningPathsServiceUrl: process.env.LEARNING_PATHS_SERVICE_URL,
		protoDir: process.env.PROTO_DIR,
	},
})
