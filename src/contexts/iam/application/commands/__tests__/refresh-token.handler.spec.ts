import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenHandler } from '../refresh-token.handler';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { TokenService } from '../../../../../shared/application/services';
import { AppException } from '../../../../../shared/domain/exceptions';

describe('RefreshTokenHandler', () => {
  let handler: RefreshTokenHandler;
  const mockUserRepo = {
    findSessionByRefreshToken: jest.fn(),
    revokeSession: jest.fn(),
    createSession: jest.fn(),
    findById: jest.fn(),
  };
  const mockTokenService = {
    generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
    generateRefreshToken: jest.fn().mockReturnValue('mock-new-refresh-token'),
    getRefreshTokenExpiresAt: jest
      .fn()
      .mockReturnValue(new Date(Date.now() + 86400000)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenHandler,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepo,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    handler = module.get<RefreshTokenHandler>(RefreshTokenHandler);
    jest.clearAllMocks();
  });

  it('should throw AppException if session is not found', async () => {
    mockUserRepo.findSessionByRefreshToken.mockResolvedValue(null);

    await expect(
      handler.execute({ refreshToken: 'invalid-token' }),
    ).rejects.toThrow(AppException);
  });

  it('should revoke expired session and throw AppException', async () => {
    mockUserRepo.findSessionByRefreshToken.mockResolvedValue({
      userId: 'user-1',
      expiresAt: new Date(Date.now() - 10000), // expired
    });
    mockUserRepo.revokeSession.mockResolvedValue(undefined);

    await expect(
      handler.execute({ refreshToken: 'expired-token' }),
    ).rejects.toThrow(AppException);

    expect(mockUserRepo.revokeSession).toHaveBeenCalledWith('expired-token');
  });

  it('should rotate refresh token and return new tokens and user', async () => {
    const validSession = {
      userId: 'user-1',
      role: 'USER',
      expiresAt: new Date(Date.now() + 100000),
    };
    const mockUser = { id: 'user-1', email: 'test@example.com' };

    mockUserRepo.findSessionByRefreshToken.mockResolvedValue(validSession);
    mockUserRepo.revokeSession.mockResolvedValue(undefined);
    mockUserRepo.createSession.mockResolvedValue(undefined);
    mockUserRepo.findById.mockResolvedValue(mockUser);

    const result = await handler.execute({
      refreshToken: 'valid-token',
      userAgent: 'Jest',
      ipAddress: '127.0.0.1',
    });

    expect(result.accessToken).toBe('mock-access-token');
    expect(result.refreshToken).toBe('mock-new-refresh-token');
    expect(result.user).toEqual(mockUser);
    expect(mockUserRepo.revokeSession).toHaveBeenCalledWith('valid-token');
    expect(mockUserRepo.createSession).toHaveBeenCalled();
  });
});
