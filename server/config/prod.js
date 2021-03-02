// 디플로이한 이후에는 prod.js에서 mongodb uri를 가져온다. MONGO_UIR라는 변수는 헤로쿠에서 직접 등록해줘야 한다.
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
