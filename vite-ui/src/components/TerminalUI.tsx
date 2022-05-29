import React, { useEffect } from 'react'
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit';
import { Socket } from 'socket.io-client';

type terminalData = {
    tConfig: { height: number, width: number },
    channel: Socket,
}

export default function TerminalUI({ tConfig, channel }: terminalData) {
    let terminal: any;
    useEffect(() => {
        if (terminal) {
            terminal.dispose();
            showTerminal();
        } else {
            showTerminal();
        }
    }, [])

    const showTerminal = () => {


        terminal = new Terminal();
        const fitAddon = new FitAddon();
        terminal.setOption("theme", {
            background: "#202B33",
        });
        terminal.loadAddon(fitAddon);
        const container: any = document.getElementById('terminal-view')
        terminal.open(container);
        fitAddon.fit()
        if (!channel.hasListeners('OUTPUT')) {
            registerListner();
        } else {
            channel.off('OUTPUT');
            registerListner();
        }

        terminal.onData((data: any) => {
            channel.emit('TERMINAL_INPUT', data);
        })
    }


    const registerListner = () => {
        channel.on("OUTPUT", (data) => {
            console.log(data)
            terminal.write(data);
        })
    }
    return (
        <div id="terminal-view" style={{ height: '400px', width: tConfig.width, }} ></div>
    )
}
