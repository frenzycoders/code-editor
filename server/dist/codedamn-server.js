"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const node_pty_1 = require("node-pty");
const node_os_1 = require("node:os");
const cors_1 = __importDefault(require("cors"));
const api_controller_1 = require("./src/apis/api_controller");
let shell = (0, node_os_1.platform)() === 'win32' ? 'powershell.exe' : 'bash';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    }
});
const PORT = 8080;
io.on('connection', (socket) => {
    console.log('connect with client: ', socket.id);
    let pty;
    socket.on('CREATE_TERMINAL', (action) => {
        console.log('hey');
        pty = (0, node_pty_1.spawn)(shell, [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env,
        });
        pty.onData((e) => {
            socket.emit('OUTPUT', e);
        });
        pty.onExit((e) => {
            socket.emit('EXIT_TERMINAL');
        });
        pty.write(action + '\r');
    });
    socket.on('TERMINAL_INPUT', (cmd) => {
        console.log(cmd);
        if (pty) {
            pty.write(cmd);
        }
    });
    socket.on('REMOVE_TERMINAL_WITH_THIS_ID', () => {
        pty.kill();
    });
    socket.on('disconnect', () => {
        console.log('user disconnected with socket id', socket.id);
    });
});
app.use('/api', api_controller_1.api);
server.listen(PORT);
console.log('server is up and running on port: ', PORT);
//# sourceMappingURL=codedamn-server.js.map