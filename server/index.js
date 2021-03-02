const express = require("express"); // express 모듈을 가져와서
const app = express(); // express 앱을 만들고
const port = 5000; // 5000번 포트의
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User"); // 모델 인스턴스를 가져옴.
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json()); // application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(cookieParser()); // 쿠키 파서를 이용할 수 있게 해줌.

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDb Connected!"))
  .catch(() => console.log("MongoDb Connected Error"));

app.get("/", (req, res) => res.send("yeah")); // 루트 디렉토리에 오면, 헬로월드를 출력

app.post("/api/users/register", (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  // {
  //   id:"hello",        이런 구조의 데이터가 req.body에 들어있다.
  //   password: 123      데이터가 이렇게 담길 수 있게 해주는 게 body parser.
  // }
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    // mongoDB method. req.body데이터가 user정보에 저장이 됨.
    //성공하지 못했다고 json형태로 전달해주고, 에러메시지도 함께 전달.

    return res.status(200).json({ success: true });
    // 성공시(200은 성공 메시지) success: true를 return하라.
  });
});

app.post("/api/users/login", (req, res) => {
  //데이터베이스 안에서 요청된 email찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "입력된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 세션스토리지 등등. 여기선 쿠키에서 진행.
        res
          .cookie("x_auth", user.token) //쿠키에 키, 값 쌍으로 저장됨.
          .status(200)
          .json({ loginSuccess: true, userId: user._id }); // 출력값.
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // auth: 미들웨어. 이 endpoint의 리퀘스트를 받은 후에 콜백펑션 실행하기 전에 뭔가 수행해주는 것.
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
  res.status(200).json({
    _id: req.user.id, // auth.js에서 req에 user정보를 담아놨기 때문에 이게 가능
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.get("/api/hello", (req, res) => {
  res.send("hi~~~");
});

app.listen(port, () => console.log(`hi ${port} asdfasdf`));
