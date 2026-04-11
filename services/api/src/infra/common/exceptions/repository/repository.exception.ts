export class RepositoryException extends Error {
  constructor(message: string, cause: unknown | null = null) {
    super(message, {
      cause: cause,
    })
  }
}