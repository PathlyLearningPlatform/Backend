export interface IQueryHandler<Query, Result = void> {
	execute(command: Query): Promise<Result>;
}
