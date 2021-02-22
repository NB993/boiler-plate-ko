const express = require("express"); // express 모듈을 가져와서
const app = express(); // express 앱을 만들고
const port = 5000; // 5000번 포트의

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://haha:hoho@boilerplate.jg3gk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDb Connected!"))
  .catch(() => console.log("MongoDb Connected Error"));

app.get("/", (req, res) => res.send("hello world")); // 루트 디렉토리에 오면, 헬로월드를 출력

app.listen(port, () => console.log(`hi ${port}`));
