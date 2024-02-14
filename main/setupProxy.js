const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://api.resas-portal.go.jp',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        })
    );
};