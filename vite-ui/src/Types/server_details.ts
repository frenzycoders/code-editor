export type ServerDetails = {
    hostname: String,
    homedir: string,
    arch: String,
    totalmem: Number,
    freemem: Number,
    platform: String,
    release: String,
}

export const INIT = 'INIT';
export const LOADING = 'LOADING';
export const ERROR = 'ERROR';
export const DONE = 'DONE';


export const ComponenetState = [INIT, LOADING, ERROR, DONE]

export const api_adress = 'http://127.0.0.1:8080/api/';