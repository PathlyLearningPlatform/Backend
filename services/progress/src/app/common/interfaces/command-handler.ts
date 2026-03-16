export interface ICommandHandler<Command, Result = void> {
	execute(command: Command): Promise<Result>;
}
