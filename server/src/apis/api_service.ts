import { Request, Response } from "express";
import { homedir, hostname, arch, freemem, totalmem, platform, release } from 'node:os';
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';

export const server_configs = async (req: Request, res: Response) => {

    res.status(200).send({
        hostname: hostname(),
        homedir: homedir(),
        arch: arch(),
        totalmem: Number((totalmem() / (1024 * 1024 * 1024)).toFixed(1)),
        freemem: Number((freemem() / (1024 * 1024 * 1024)).toFixed(1)),
        platform: platform(),
        release: release(),
    });

}

export const read_fileSystem = async (req: Request, res: Response) => {
    try {
        let { path } = req.query;
        if (!path) {
            let dirs: String[] = await readdir(homedir());
            return res.status(200).send(dirs);
        } else {
            let dirs: String[] = await readdir(path as string);
            return res.status(200).send(dirs);
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}