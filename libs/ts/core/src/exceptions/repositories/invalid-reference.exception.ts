import { RepositoryException } from "./base.exception";

export class InvalidReferenceException extends RepositoryException {
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause)
  }
}