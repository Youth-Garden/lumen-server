import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as publicly accessible (no JWT required).
 * - Bypasses the global JwtAuthGuard at runtime.
 * - Overrides the global Swagger security so Swagger UI shows no 🔒.
 */
export const Public = () =>
  applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiSecurity({}), // Override global bearer security in Swagger
  );
