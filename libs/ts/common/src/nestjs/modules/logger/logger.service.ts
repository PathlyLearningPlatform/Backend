import { ConsoleLogger, Injectable, Scope, type LoggerService } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger { }