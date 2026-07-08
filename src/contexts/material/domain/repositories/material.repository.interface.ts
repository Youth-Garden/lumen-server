export const MATERIAL_REPOSITORY = Symbol('MATERIAL_REPOSITORY');

export interface IMaterialRepository {
  findById(id: string): Promise<unknown | null>;
  findAll(
    type?: string,
    page?: number,
    limit?: number,
  ): Promise<{ items: unknown[]; total: number }>;
}
