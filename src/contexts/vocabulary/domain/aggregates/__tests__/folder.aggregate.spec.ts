import { Folder } from '../folder.aggregate';
import { FolderCreatedEvent } from '../../events/folder-created.event';

describe('Folder Aggregate', () => {
  const mockAuthorId = 'user-uuid-123';
  const mockName = { en: 'Academic Vocabulary', vi: 'Từ vựng học thuật' };
  const mockDescription = { en: 'Essential words', vi: 'Từ vựng cốt lõi' };

  describe('create', () => {
    it('should create a new folder aggregate and record FolderCreatedEvent', () => {
      // Act
      const folder = Folder.create(
        mockName,
        mockDescription,
        mockAuthorId,
        null,
        false,
      );

      // Assert
      expect(folder.id).toBeDefined();
      expect(folder.name).toEqual(mockName);
      expect(folder.description).toEqual(mockDescription);
      expect(folder.authorId).toBe(mockAuthorId);
      expect(folder.isSystem).toBe(false);

      const events = folder.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FolderCreatedEvent);
      expect((events[0] as FolderCreatedEvent).folderId).toBe(folder.id);
    });
  });

  describe('restore', () => {
    it('should restore an existing folder without raising uncommitted domain events', () => {
      // Arrange
      const existingId = 'existing-uuid-456';

      // Act
      const folder = Folder.restore(
        existingId,
        mockName,
        mockDescription,
        mockAuthorId,
        { en: 'Exam', vi: 'Thi cử' },
        true,
      );

      // Assert
      expect(folder.id).toBe(existingId);
      expect(folder.isSystem).toBe(true);
      expect(folder.category).toEqual({ en: 'Exam', vi: 'Thi cử' });
      expect(folder.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('localization getters', () => {
    it('should return correct localized strings for requested locale and fallback', () => {
      const folder = Folder.restore(
        'f-1',
        mockName,
        mockDescription,
        mockAuthorId,
        { en: 'Exam', vi: 'Thi cử' },
        false,
      );

      expect(folder.getLocalizedName('vi')).toBe('Từ vựng học thuật');
      expect(folder.getLocalizedName('en')).toBe('Academic Vocabulary');
      expect(folder.getLocalizedName('ja', 'en')).toBe('Academic Vocabulary');

      expect(folder.getLocalizedDescription('vi')).toBe('Từ vựng cốt lõi');
      expect(folder.getLocalizedDescription('en')).toBe('Essential words');

      expect(folder.getLocalizedCategory('vi')).toBe('Thi cử');
      expect(folder.getLocalizedCategory('en')).toBe('Exam');
    });
  });

  describe('update', () => {
    it('should update folder details correctly', () => {
      const folder = Folder.restore(
        'f-1',
        mockName,
        mockDescription,
        mockAuthorId,
        null,
        false,
      );

      const updatedName = { en: 'New Name', vi: 'Tên mới' };
      const updatedCategory = { en: 'Grammar', vi: 'Ngữ pháp' };

      folder.update(updatedName, null, updatedCategory);

      expect(folder.name).toEqual(updatedName);
      expect(folder.description).toBeNull();
      expect(folder.category).toEqual(updatedCategory);
    });
  });
});
