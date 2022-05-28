import { platform } from 'node:os';
import { spawn } from 'node-pty'
import { Socket } from 'socket.io';


export default class PTY {
    private shell: string;
    private ptyProcess: any;
    private socket: Socket;

    constructor(socket: Socket) {
        this.shell = platform() === 'win32' ? 'powershell.exe' : 'bash';
        this.ptyProcess = null;
        this.socket = socket;
        this.startPtyProcess();
    }


    private startPtyProcess() {
        this.ptyProcess = spawn(this.shell, [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env,
        })

        this.ptyProcess.on('data', (data: any) => {
            this.sendToClient(data.toString());
        })
    }

    public write(data: any) {
        this.ptyProcess.write(data);
    }

    private sendToClient(data: any) {
        this.socket.emit("output", data);
    }
}