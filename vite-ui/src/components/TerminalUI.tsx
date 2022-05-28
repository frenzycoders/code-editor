import React, { useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SocketContext } from '../socket'

function TerminalUI() {
    const socket = useContext(SocketContext);
    let terminal: any = null;
    useEffect(() => {
        if (terminal == null) {
            showTerminal();
        } else {
            terminal.dispose();
            showTerminal();
        }
    }, [])
    socket.on('connection', (socket: Socket) => {
        console.log('Client Connected with server');

        socket.on('disconnect', () => {
            console.log('Disconnected')
        })
    })
    const showTerminal = () => {
        terminal = new Terminal()
        terminal.setOption("theme", {
            background: "#202B33",
        });
        terminal.loadAddon(new WebLinksAddon());
        terminal.onData((data: any) => {
            socket.emit('input', data);
        })

        socket.on("output", (data) => {
            terminal.write(data);
        })
        const container: any = document.getElementById('terminal-view')
        terminal.open(container);
    }
    return (
        <div id="terminal-view" style={{ height: 500, width: 600 }}>TerminalUI</div>
    )
}

export default TerminalUI