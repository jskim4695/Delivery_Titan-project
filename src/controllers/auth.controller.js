export class AuthController {
  generateAccessToken = async (req, res) => {
    const { refreshToken } = req.body; // http로 넘어온 값을 파싱하고

    const token = await AuthService.verifyFreshToken(refreshToken); // 서비스 레이어의 코드를 호출하고
    return res.json(token); // 프론트로 반환한다.
  };
}
