import { DbException } from "../db/db.exception";

export class InvalidReferenceException extends DbException {
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause, true)
  }
}