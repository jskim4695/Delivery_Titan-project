import { expect, jest } from '@jest/globals';
import { UserController } from '../../../src/controllers/users.controller';

describe('UserController', () => {
  let mockUserService;
  let userController;
  let mockReq, mockRes;

  beforeEach(() => {
    jest.resetAllMocks();
    mockUserService = {
      userSignUp: jest.fn(),
      userSignIn: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
    };
    mockReq = {
      params: {},
      body: {},
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
      session: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    userController = new UserController(mockUserService);
  });

  it('회원가입 컨트롤러 test', async () => {
    const user = {
      email: 'jskim@example.com',
      password: 'password123',
      checkPw: 'password123',
      name: 'JS Kim',
      nickname: 'JIN',
      phone: '1234567890',
      address: '부산시 강서구',
      role: 'CUSTOMER',
    };
    mockReq.body = user;

    const expectedUserForService = {
      email: user.email,
      password: user.password,
      name: user.name,
      nickname: user.nickname,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    const expectedUserForResponse = {
      name: user.name,
      nickname: user.nickname,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    mockUserService.userSignUp.mockResolvedValueOnce(expectedUserForResponse);
    await userController.userSignUp(mockReq, mockRes);

    expect(mockUserService.userSignUp).toHaveBeenCalledTimes(1);
    expect(mockUserService.userSignUp).toHaveBeenCalledWith(
      expectedUserForService
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expectedUserForResponse);
  });

  it('로그인 컨트롤러 성공 케이스 테스트', async () => {
    const user = {
      email: 'jskim@example.com',
      password: 'password123',
    };
    mockReq.body = user;

    const token = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    mockUserService.userSignIn.mockResolvedValueOnce(token);

    await userController.userSignIn(mockReq, mockRes);

    expect(mockUserService.userSignIn).toHaveBeenCalledWith({
      email: user.email,
      password: user.password,
      ip: mockReq.ip,
      userAgent: mockReq.headers['user-agent'],
    });
    expect(mockRes.json).toHaveBeenCalledWith(token);
  });

  it('정보 조회 컨트롤러 test', async () => {
    const user = {
      id: 1,
      email: 'jskim@example.com',
      password: 'password123',
      name: 'JS Kim',
      nickname: 'JIN',
      phone: '1234567890',
      address: '부산시 강서구',
      role: 'CUSTOMER',
    };
    mockReq.userId = user.id;
    mockUserService.getUserById.mockResolvedValue(user);

    await userController.getUser(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(user);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(mockReq.userId);
  });

  it('프로필 수정 test', async () => {
    const userId = 1;
    const requestBody = {
      password: 'password123',
      name: 'JS Kim',
      nickname: 'JIN',
      phone: '1234567890',
      address: '부산시 강서구',
      role: 'CUSTOMER',
      profileImg: 'S3.com????',
    };
    const updatedData = {
      ...requestBody,
      profileImage: requestBody.profileImg,
    };
    delete updatedData.profileImg;

    mockReq.userId = userId;
    mockReq.body = requestBody;
    mockReq.file = { location: requestBody.profileImg };
    mockUserService.updateUser.mockResolvedValue(updatedData);

    await userController.editInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: '정보수정에 성공하였습니다.',
    });
    expect(mockUserService.updateUser).toHaveBeenCalledWith(
      userId,
      updatedData
    );
  });
});
