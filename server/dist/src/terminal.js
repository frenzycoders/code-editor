"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_os_1 = require("node:os");
const node_pty_1 = require("node-pty");
class PTY {
    constructor(socket) {
        this.shell = (0, node_os_1.platform)() === 'win32' ? 'powershell.exe' : 'bash';
        this.ptyProcess = null;
        this.socket = socket;
        this.startPtyProcess();
    }
    startPtyProcess() {
        this.ptyProcess = (0, node_pty_1.spawn)(this.shell, [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env,
        });
        this.ptyProcess.on('data', (data) => {
            this.sendToClient(data.toString());
        });
    }
    write(data) {
        this.ptyProcess.write(data);
    }
    sendToClient(data) {
        this.socket.emit("output", data);
    }
}
exports.default = PTY;
//# sourceMappingURL=terminal.js.map