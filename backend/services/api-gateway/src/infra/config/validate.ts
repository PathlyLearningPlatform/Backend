import { appConfigSchema } from '@infra/common/schemas';
import { ConfigException, parseIntOrReturn } from 'common/index.js';

export function validateConfig(config: Record<string, unknown>) {
  const transformedConfig = {
    app: {
      port: parseIntOrReturn(config.PORT),
    },
  };

  const result = appConfigSchema.safeParse(transformedConfig);

  if (result.success) {
    return result.data;
  }

  throw new ConfigException(result.error.message, result.error);
}
