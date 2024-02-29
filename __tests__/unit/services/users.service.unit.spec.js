import { expect, jest } from '@jest/globals';
import { UserService } from '../../../src/services/users.service';

// jest.mock('multer-s3', () => ({
//   AUTO_CONTENT_TYPE: jest.fn(),
//   S3: jest.fn(),
//   multerS3: function (options) {
//     return {
//       _handleFile: jest.fn(),
//       _removeFile: jest.fn(),
//       bucket: options.bucket, // 이 부분을 수정
//     };
//   },
// }));
// jest.mock('@aws-sdk/client-s3', () => ({
//   DeleteObjectCommand: jest.fn(),
//   S3: jest.fn(() => ({
//     send: jest.fn(),
//   })),
// }));

// jest.mock('multer', () => ({
//   diskStorage: jest.fn(),
//   memoryStorage: jest.fn(),
//   Multer: jest.fn(),
//   multer: jest.fn(() => ({
//     array: jest.fn(),
//     fields: jest.fn(),
//     none: jest.fn(),
//     single: jest.fn(),
//   })),
// }));

describe('UserService', () => {
  let mockUserRepository;
  let userService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUserRepository = {
      createUser: jest.fn(),
      selectOneUserByEmail: jest.fn(),
      findOneUserByUserId: jest.fn(),
      getStoreByOwnerId: jest.fn(),
      updateUserByUserId: jest.fn(),
    };
    userService = new UserService(mockUserRepository);
  });

  it('회원가입 test', async () => {
    const user = {
      email: 'jskim@example.com',
      password: 'password123',
      name: 'JS Kim',
      nickname: 'JIN',
      phone: '1234567890',
      address: '부산시 강서구',
      role: 'CUSTOMER',
    };

    mockUserRepository.selectOneUserByEmail.mockResolvedValue(user);
    mockUserRepository.createUser.mockResolvedValue(user);
    const result = await userService.createUser(
      user.email,
      user.password,
      user.name,
      user.nickname,
      user.phone,
      user.address,
      user.role
    );
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('회원정보 조회 test', async () => {
    const user = {
      id: 1,
      email: 'jskim@example.com',
      nickname: 'JIN',
      createdAt: '2024-02-27T14:49:40.662Z',
    };
    mockUserRepository.findOneUserByUserId.mockResolvedValue(user);
    mockUserRepository.getStoreByOwnerId.mockResolvedValue(user);
    const result = await userService.getUserById(
      user.id,
      user.email,
      user.nickname,
      user.createdAt
    );

    expect(mockUserRepository.findOneUserByUserId).toHaveBeenCalledWith(
      user.id
    );
    expect(result).toEqual(user);
  });

  it('should return null if user not found on get by ID', async () => {
    mockUserRepository.findOneUserByUserId.mockResolvedValue(null);
    const result = await userService.getUserById('사용자를 찾을 수 없습니다.');

    expect(result).toBeNull();
  });

  it('회원정보 수정 test', async () => {
    const user = {
      name: 'JS Kim',
      password: 'password123',
      nickname: 'JIN',
      phone: '1234567890',
      address: '부산시 강서구',
      role: 'OWNER',
      profileImg: 'mocked S3 URL',
    };
    mockUserRepository.findOneUserByUserId.mockResolvedValue(user);
    mockUserRepository.updateUserByUserId.mockResolvedValue(user);
    const result = await userService.updateUser(
      user.id,
      user.password,
      user.name,
      user.nickname,
      user.phone,
      user.address,
      user.role,
      user.profileImg
    );

    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      user.id,
      user.id,
      user.password,
      user.name,
      user.nickname,
      user.phone,
      user.address,
      user.role,
      user.profileImg
    );
    expect(result).toEqual(user);
  });

  it('should return null when trying to update a non-existent user', async () => {
    mockUserRepository.findOneUserByUserId.mockResolvedValue(null);
    const result = await userService.updateUser(
      '사용자를 찾을 수 없습니다.',
      '사용자를 찾을 수 없습니다.',
      '사용자를 찾을 수 없습니다.'
    );

    expect(result).toBeNull();
  });
});
