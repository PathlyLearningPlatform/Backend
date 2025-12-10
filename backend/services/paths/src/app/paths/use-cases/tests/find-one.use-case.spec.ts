import { FindOnePathUseCase } from "../find-one.use-case";
import { mockedFindOneCommand } from "./mocks/commands.mock";
import { mockedPath } from "./mocks/paths.mock";
import { mockedPathsRepository } from "./mocks/paths.repository.mock";
import { PathNotFoundException } from "@/domain/paths/exceptions";

describe('FindOnePathUseCase', () => {
  let findOnePathUseCase: FindOnePathUseCase;

  beforeEach(() => {
    findOnePathUseCase = new FindOnePathUseCase(mockedPathsRepository);
  })

  describe('execute', () => {
    it('should throw a PathNotFoundException', async () => {
      mockedPathsRepository.findOne.mockResolvedValueOnce(null);

      const promise = findOnePathUseCase.execute({
        where: {
          id: 'unknown id',
        }
      })

      await expect(promise).rejects.toThrow(PathNotFoundException)
    })

    it('should return a path', async () => {
      const expectedResult = mockedPath;

      mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);

      const result = await findOnePathUseCase.execute(mockedFindOneCommand)

      expect(result).toEqual(expectedResult)
    })
  })
})