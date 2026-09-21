import { Test, TestingModule } from '@nestjs/testing';
import { CreateFolderHandler } from '../create-folder.handler';
import { CreateFolderCommand } from '../create-folder.command';
import { FOLDER_REPOSITORY } from '../../../domain/repositories/folder.repository.interface';
import { Folder } from '../../../domain/aggregates/folder.aggregate';

describe('CreateFolderHandler', () => {
  let handler: CreateFolderHandler;
  const mockFolderRepository = {
    save: jest
      .fn()
      .mockImplementation((folder: Folder) => Promise.resolve(folder)),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFolderHandler,
        {
          provide: FOLDER_REPOSITORY,
          useValue: mockFolderRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateFolderHandler>(CreateFolderHandler);
    jest.clearAllMocks();
  });

  it('should create and persist a new folder aggregate and return its id', async () => {
    // Arrange
    const command = new CreateFolderCommand(
      { en: 'Test Folder', vi: 'Thư mục kiểm thử' },
      { en: 'Description', vi: 'Mô tả' },
      'author-uuid-123',
    );

    // Act
    const folderId = await handler.execute(command);

    // Assert
    expect(folderId).toBeDefined();
    expect(typeof folderId).toBe('string');
    expect(mockFolderRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFolderRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: { en: 'Test Folder', vi: 'Thư mục kiểm thử' },
        authorId: 'author-uuid-123',
      }),
    );
  });
});
