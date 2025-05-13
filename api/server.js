const http = require('http');
const detectPort = require('detect-port').default;  // ✅ Fix import
const app = require('./app');

const DEFAULT_PORT = process.env.PORT || 3002;

detectPort(DEFAULT_PORT).then((availablePort) => {
    const server = http.createServer(app);
    server.listen(availablePort, () => {
        console.log(`Server started on port ${availablePort}`);
    });
}).catch((err) => {
    console.error("Port detection error:", err);
});
