import { Folder } from '../aggregates/folder.aggregate';

export const FOLDER_REPOSITORY = Symbol('FOLDER_REPOSITORY');

export interface IFolderRepository {
  save(folder: Folder): Promise<void>;
  findById(id: string): Promise<Folder | null>;
  findByUserId(userId: string): Promise<Folder[]>;
  delete(id: string): Promise<void>;
}
