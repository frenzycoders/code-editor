import { createServer, Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import Express, { Application } from 'express';
import pty, { IPty, spawn, } from 'node-pty'
import { platform } from 'node:os';
import cors from 'cors';
import { createConnection } from 'mysql'
import { writeFile, readFile } from 'node:fs/promises';
import { api } from './src/apis/api_controller';

declare global {
    namespace Express {
        interface Request {
            entity: String
        }
    }
}

let shell: string = platform() === 'win32' ? 'powershell.exe' : 'bash';

const app: Application = Express();

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const server: HttpServer = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const PORT = 8080;

// let ptyProcess = spawn(shell, [], {
//     name: 'xterm-color',
//     cwd: process.env.HOME,
//     env: process.env,
// })



io.on('connection', (socket: Socket) => {
    console.log('connect with client: ', socket.id);

    let pty: IPty;



    socket.on('CREATE_TERMINAL', (action: any) => {
        console.log('hey');
        pty = spawn(shell, [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env,
        })

        pty.onData((e: string) => {
            socket.emit('OUTPUT', e);
        })

        pty.onExit((e: any) => {
            socket.emit('EXIT_TERMINAL')
        })

        pty.write(action + '\r');
    });


    socket.on('TERMINAL_INPUT', (cmd: string) => {
        console.log(cmd)
        if (pty) {
            pty.write(cmd);
        }
    })



    socket.on('REMOVE_TERMINAL_WITH_THIS_ID', () => {
        pty.kill();
    })


    // socket.on('input', (data: any) => {
    //     ptyProcess.write(data);
    // })

    // ptyProcess.onData((data) => {
    //     console.log(data)
    //     socket.emit("output", data);
    // })


    // socket.on('disconnect', () => {
    //     console.log('Disconnected with client: ', socket.id);
    // })

    socket.on('disconnect', () => {
        console.log('user disconnected with socket id', socket.id)
    })
})


app.use('/api', api);

server.listen(PORT);
console.log('server is up and running on port: ', PORT)

