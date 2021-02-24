const express = require("express"); // express 모듈을 가져와서
const app = express(); // express 앱을 만들고
const port = 5000; // 5000번 포트의
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User"); // 모델 인스턴스를 가져옴.

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json()); // application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해줌.

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

app.post("/register", (req, res) => {
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

app.listen(port, () => console.log(`hi ${port} asdfasdf`));
