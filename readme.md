## User Interface 
![App Screenshot](./code-editor.png)

# Live Link [http://code-editor.myportfolio.club]


## SERVER SETUP 
```bash 
    cd code-editor/server
```
```bash 
    npm i 
```
```bash
    npm i -D
```
```bash 
    npm run dev
```

- server started at port 8090 by using these commands

## CLIENT SETUP
- Navigate to vite-ui folder of this project
- run below command
```bash 
    npm i
```
and,
```bash
    npm i -D
```
- open server_details.ts which is located in vite-ui/src/Types/ folder
[server_details.ts image](./server_details.png)
```bash
    you can change value of api_adress this variable contains root url of your server 
```
- if you change value in server_details.ts file then you also have to change url value for socket connection
- open socket.tsx file which is located in vite-ui/src/context/socket.tsx and change
[socket.tsx image](./socket.png)
```bash
    export const socket = io('http://localhost');
```
to,
```bash
    export const socket = io(<your_localip or domain>)
```

