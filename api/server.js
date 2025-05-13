const http = require('http');
const port = 3001;
const app = require('./app');
const server = http.createServer(app);

server.listen(port, ()=>{
    console.log('This app is running . . .');
});