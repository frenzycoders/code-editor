import React, { createContext } from 'react';
import io from "socket.io-client";

export const socket = io('http://api.code-editor.myportfolio.club');

export const SocketContext = createContext(socket);