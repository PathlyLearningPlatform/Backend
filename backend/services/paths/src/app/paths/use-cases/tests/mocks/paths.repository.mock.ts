import type { IPathsRepository } from "@/domain/paths/interfaces";

export const mockedPathsRepository: jest.Mocked<IPathsRepository> = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}