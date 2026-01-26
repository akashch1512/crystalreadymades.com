const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.VITE_API_URL, // correct
      changeOrigin: true,
      secure: false, // ignore SSL errors (dev only)
    })
  );
};
