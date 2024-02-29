import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3 } from '../utils/multer/multer.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  userSignUp = async (data) => {
    try {
      const { email, password, name, nickname, phone, address, role } = data;

      const user = await this.userRepository.selectOneUserByEmail(email);
      if (user) {
        throw {
          code: 401,
          message: '이미 가입한 이메일입니다.',
        };
      }

      await this.userRepository.createUser({
        email,
        password: await bcrypt.hash(password, 10),
        name,
        nickname,
        phone,
        address,
        role,
      });
    } catch (err) {
      throw err;
    }
  };

  userSignIn = async ({ email, password, ip, userAgent }) => {
    try {
      let user;

      // email 로그인
      if (!email) {
        throw {
          code: 400,
          message: '이메일은 필수값입니다.',
        };
      }

      if (!password) {
        throw {
          code: 400,
          message: '비밀번호는 필수값입니다.',
        };
      }

      user = await this.userRepository.selectOneUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw {
          code: 401,
          message: '올바르지 않은 로그인 정보입니다.',
        };
      }

      // 로그인 성공
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: '12h',
        }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role, ip, userAgent },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  };

  getUserById = async (userId) => {
    try {
      const user = await this.userRepository.findOneUserByUserId(userId);

      if (!user) {
        throw {
          code: 401,
          message: '올바르지 않은 로그인 정보입니다.',
        };
      }

      if (user.role === 'CUSTOMER') {
        return {
          nickname: user.nickname,
          email: user.email,
          createdAt: user.createdAt,
          profileImage: user.profileImage,
        };
      } else if (user.role === 'OWNER') {
        const store = await this.userRepository.getStoreByOwnerId(userId);
        if (!store) {
          return {
            nickname: user.nickname,
            email: user.email,
            profileImage: user.profileImage,
            storeName: 'store를 등록해주세요.',
          };
        } else {
          return {
            nickname: user.nickname,
            email: user.email,
            profileImage: user.profileImage,
            storeName: store.storeName,
            createdAt: store.createdAt,
          };
        }
      }
    } catch (err) {
      throw err;
    }
  };

  updateUser = async (userId, data) => {
    try {
      const user = await this.userRepository.findOneUserByUserId(userId);

      if (!user) {
        throw {
          code: 401,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 만약 프로필 사진이 이미 있다면, s3에서 기존 이미지 삭제
      if (user.profileImage) {
        const imageName = user.profileImage.split('com/')[1];
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: imageName,
        });
        try {
          await s3.send(deleteCommand);
        } catch (err) {
          next(err);
        }
      }

      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await this.userRepository.updateUserByUserId(
        userId,
        data
      );
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };
}
