export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  userSignUp = async (req, res) => {
    const {
      email,
      clientId,
      password,
      checkPw,
      name,
      nickname,
      phone,
      address,
      role,
    } = req.body;

    if (!clientId) {
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: '이메일은 필수값입니다.' });
      }

      if (role && !['CUSTOMER', 'OWNER'].includes(role)) {
        return res
          .status(400)
          .json({ success: false, message: '등급이 올바르지 않습니다.' });
      }

      if (
        !password ||
        !checkPw ||
        !name ||
        !nickname ||
        !phone ||
        !address ||
        !role
      ) {
        return res
          .status(400)
          .json({ success: false, message: '필수값을 모두 입력해주세요.' });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ success: false, message: '비밀번호는 최소 6자 이상입니다.' });
      }

      if (password !== checkPw) {
        return res.status(400).json({
          success: false,
          message: '비밀번호와 비밀번호 확인의 값이 일치하지 않습니다.',
        });
      }

      try {
        await this.userService.userSignUp({
          email,
          clientId,
          password,
          name,
          nickname,
          phone,
          address,
          role,
        });

        return res.status(201).json({ name, nickname, phone, address, role });
      } catch (err) {
        return res.status(err.code).json({ message: err.message });
      }
    }
  };

  userSignIn = async (req, res) => {
    const { clientId, email, password } = req.body;

    try {
      const token = await this.userService.userSignIn({
        clientId,
        email,
        password,
      });

      req.session.accessToken = token.accessToken;
      req.session.refreshToken = token.refreshToken;

      return res.json(token);
    } catch (err) {
      return res.status(err.code).json({ message: err.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        });
      }

      return res.json(user);
    } catch (err) {
      console.log(err);
    }
  };

  editInfo = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { password, name, nickname, phone, address, role } = req.body;

      //TODO 나중에 살리기 + 라우터에 미들웨어 추가
      // if (req.userId !== userId) {
      //   return res.status(403).json({
      //     success: false,
      //     message: '접근 권한이 없습니다.',
      //   });
      // }
      const data = {};

      if (password || name || nickname || phone || address || role) {
        data.password = password;
        data.name = name;
        data.nickname = nickname;
        data.phone = phone;
        data.address = address;
        data.role = role;
      }

      // 이미지 부분 추가했어요~~
      if (req.file) data.profileImage = req.file.location;

      await this.userService.updateUser(userId, data);

      return res
        .status(200)
        .json({ success: true, message: '정보수정에 성공하였습니다.' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
}
