import { ConsoleLogger, Injectable, Scope, type LoggerService } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger implements LoggerService {
  constructor() {
    super()
    this.options.timestamp = true;
  }

  log(message: unknown, context?: string): void {
    super.log(message, context)
  }

  warn(message: unknown, context?: string): void {
    super.warn(message, context)
  }

  error(message: unknown, stack?: string, context?: string): void {
    super.error(message, stack, context)
  }

  debug(message: unknown, context?: string): void {
    super.debug(message, context)
  }

  fatal(message: unknown, context?: string): void {
    super.fatal(message, context)
  }
}