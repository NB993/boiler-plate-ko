import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then(
      // 서버에 end point( /api/hello )로 요청을 보냄. node에서 실행중인 index.js로 요청이 감.
      (response) => console.log(response.data)
    );
  }, []);
  // 에러남. 프론트서버는 3천번 포트, 백엔드는 5천번 포트임.
  // 이걸 고친다고 axios.get("http://localhost:5000/api/hello")로 바꿔서 요청을 보내면 CORS에러 !

  // [해결책]
  // proxy 모듈을 설치하고 타겟 url을 "http://localhost:5000"로 세팅해준 다음, axios로 보내는 요청 url부분에서
  // "http://localhost:5000" 를 빼고 적으면 된다.

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>
    </div>
  );
}

export default LandingPage;
