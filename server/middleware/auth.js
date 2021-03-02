const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리를 하는 곳
  // 1. 클라이언트 쿠키에서 토큰을 가져옴 (쿠키 파서 이용)
  let token = req.cookies.x_auth; // x_auth라는 이름으로 넣은 토큰이 담긴 쿠키를 가져옴.

  // 2. 가져온 토큰을 복호화한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    console.log(token);
    req.token = token;
    req.user = user;
    next(); // 미들웨어 작업이 끝나면 다음으로 진행되도록.
  });
  // 3. 유저가 있으면 인증 okay
  // 4. 유저가 없으면 인증 no
};

module.exports = { auth };
