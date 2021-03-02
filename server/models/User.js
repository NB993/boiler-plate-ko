const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt가 몇글자인지 나타냄.
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    // 유효성 관리
    type: String,
  },
  tokenExp: {
    // 토큰 유효기간
    type: Number,
  },
});

//mongoose메서드. user model에 유저 정보를 저장하기 전에 뭔가 작업을 수행할 수 있는 메서드.
userSchema.pre("save", function (next) {
  // salt를 이용해서 비밀번호를 암호화한다.
  console.log("this: ", this);
  let user = this; // schema

  if (user.isModified("password")) {
    // 비밀번호가 변경됐을 때에만 암호화를 수행한다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); // next하면 바로 save로 들어감. save에 err던지면서 되돌아감.

      bcrypt.hash(
        user.password /*클라이언트에서 순수하게 넘어오는 비밀번호. palin password라고 함.*/,
        salt,
        function (err, hash) {
          // hash : 암호화된 비밀번호
          if (err) return next(err);
          user.password = hash; // hash로 암호화됐다면 hash된 비밀번호로 교체.
          next(); //작업이 다 끝나면 이제 save로 다시 되돌려보냄.
        }
      );
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //넘어온 plainPassword와 데이터베이스에 암호화된 비밀번호가 같은지 체크
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null /*에러는 없고*/, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  console.log("gen: ", token);
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰 복호화
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user); //에러가 없다면 user를 전달;
    }); //몽고db 스탠다드 메서드
  });
};
const User = mongoose.model("User", userSchema); // 스키마를 모델로 감싼다. User 스키마를 리턴.
// 이 모델을 다른 파일에서도 쓰도록 export
module.exports = { User };
