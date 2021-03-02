if (process.env.NODE_ENV === "production") {
  //환경변수 === 디플로이한 이후면
  module.exports = require("./prod");
} else {
  // 로컬 개발환경이면
  module.exports = require("./dev");
}
