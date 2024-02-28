import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/users.repository.js';

export class AuthService {
  verifyFreshToken = async (refreshToken) => {
    const token = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    ); // 토큰을 검증
    if (!token.userId) {
      throw {
        code: 401,
        message: '토큰 정보가 올바르지 않습니다.',
      };
    }

    const user = await UserRepository.findOneUserByUserId(token.userId); // 데이터가 필요하면 저장소의 코드를 호출해서 반환받음

    if (!user) {
      throw {
        code: 401,
        message: '토큰 정보가 올바르지 않습니다.',
      };
    }

    // freshToken 유효함 -> accessToken, refreshToken 재발급
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '12h',
      }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '7d',
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };
}
