const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000", //노드서버가 5천번 포트를 이용중.
      changeOrigin: true,
    })
  );
};
