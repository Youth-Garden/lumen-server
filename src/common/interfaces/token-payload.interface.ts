import { TokenType } from '../enums/token-type.enum';

export interface TokenPayload {
  sub: string;
  role?: string;
  type: TokenType;
}
