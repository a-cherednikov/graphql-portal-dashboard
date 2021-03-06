import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import AppModule from '../../modules/app.module';
import SourceService from '../../modules/source/source.service';
import { SourceConfig } from '@graphql-portal/types';
import { ISourceDocument } from '../../data/schema/source.schema';
import ApiDefService from '../../modules/api-def/api-def.service';
import {
  sourceExample,
  mongoDocumentSchema,
  expectSource,
  randomObjectId,
} from '../common';

jest.useFakeTimers();

jest.mock('ioredis');

describe('SourceService', () => {
  let app: TestingModule;
  let sourceService: SourceService;
  let apiDefService: ApiDefService;
  let source: ISourceDocument;

  const userId = randomObjectId();

  beforeAll(async () => {
    app = await Test.createTestingModule({ imports: [AppModule] }).compile();
    await Promise.all(mongoose.connections.map((c) => c.db?.dropDatabase()));

    sourceService = app.get<SourceService>(SourceService);
    apiDefService = app.get<ApiDefService>(ApiDefService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('findAllByUser returns empty array', async () => {
      const result = await sourceService.findAllByUser(userId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should create a source', async () => {
      source = await sourceService.create(sourceExample, userId);
      expect(source).toBeDefined();
      expectSource(source);
    });

    it('findAllByUser returns a source', async () => {
      const result = await sourceService.findAllByUser(userId);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
    });

    it('findByIds returns a source', async () => {
      expect(source.id).toBeDefined();
      const result = await sourceService.findByIds([source.id!]);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should throw for wrong name', async () => {
      expect.assertions(1);
      const id = randomObjectId();
      await expect(() =>
        sourceService.update(id, {} as SourceConfig)
      ).rejects.toThrow(`Source with id ${id} does not exist`);
    });

    it('should update document and call publishApiDefsUpdated', async () => {
      const isSourceUsedMock = jest
        .spyOn(apiDefService, 'isSourceUsed')
        .mockResolvedValueOnce(1 as any);
      const setLastUpdateTimeMock = jest
        .spyOn(apiDefService, 'setLastUpdateTime')
        .mockResolvedValueOnce(1 as never);
      const publishApiDefsUpdatedMock = jest
        .spyOn(apiDefService, 'publishApiDefsUpdated')
        .mockResolvedValueOnce(1);

      const newData = { ...source.toJSON(), transforms: [{}] } as SourceConfig;
      const result = await sourceService.update(source._id, newData);

      expect(result).toBeDefined();
      expect(result.toJSON()).toMatchObject({
        ...newData,
        ...mongoDocumentSchema,
      });
      expect(isSourceUsedMock).toHaveBeenCalledTimes(1);
      expect(setLastUpdateTimeMock).toHaveBeenCalledTimes(1);
      expect(publishApiDefsUpdatedMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should throw for wrong name', async () => {
      expect.assertions(2);
      const isSourceUsedMock = jest
        .spyOn(apiDefService, 'isSourceUsed')
        .mockResolvedValueOnce(1 as any);
      await expect(() => sourceService.delete(source._id)).rejects.toThrow(
        'is used'
      );
      expect(isSourceUsedMock).toHaveBeenCalledTimes(1);
    });

    it('should delete document and call publishApiDefsUpdated', async () => {
      const isSourceUsedMock = jest
        .spyOn(apiDefService, 'isSourceUsed')
        .mockResolvedValueOnce(0 as any);

      const result = await sourceService.delete(source._id);

      expect(result).toBe(true);
      expect(isSourceUsedMock).toHaveBeenCalledTimes(1);
    });
  });
});
