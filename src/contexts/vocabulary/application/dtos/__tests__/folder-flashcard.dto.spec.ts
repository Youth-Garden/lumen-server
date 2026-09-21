import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFolderDto, CreateFlashcardDto } from '../folder-flashcard.dto';

describe('Folder & Flashcard DTOs', () => {
  describe('CreateFolderDto', () => {
    it('should validate successfully with valid name and optional description', async () => {
      const dto = plainToInstance(CreateFolderDto, {
        name: 'TOEIC Mastery',
        description: 'Advanced vocabulary for test preparation',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is empty or missing', async () => {
      const dto = plainToInstance(CreateFolderDto, {
        name: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });
  });

  describe('CreateFlashcardDto', () => {
    it('should validate successfully when valid UUIDs are supplied', async () => {
      const dto = plainToInstance(CreateFlashcardDto, {
        folderId: 'a1b2c3d4-e5f6-4a8b-9c0d-1e2f3a4b5c6d',
        wordId: 'f1e2d3c4-b5a6-4788-8654-3210fedcba98',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when folderId is not a valid UUID', async () => {
      const dto = plainToInstance(CreateFlashcardDto, {
        folderId: 'invalid-id',
        wordId: 'f1e2d3c4-b5a6-4788-8654-3210fedcba98',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('folderId');
    });
  });
});
