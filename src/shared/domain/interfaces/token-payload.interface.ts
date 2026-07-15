import { TokenType } from '../../constants/enums/token-type.enum';

export interface TokenPayload {
  sub: string;
  role?: string;
  type: TokenType;
}
