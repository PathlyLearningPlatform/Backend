import { RepositoryException } from "./base.exception";

export class UniqueConstraintException extends RepositoryException {
  constructor(public readonly fields: string[]) {
    let message = `Combination of fields: ${JSON.stringify(fields)} must be unique.`;

    super(message)
  }
}