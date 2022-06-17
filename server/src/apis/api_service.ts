import { Request, Response } from "express";
import { homedir, hostname, arch, freemem, totalmem, platform, release } from 'node:os';
import { readdir, readFile, stat, writeFile, mkdir, rm, copyFile, rename } from 'node:fs/promises';
import { entityType } from './types';
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
        let path = req.query.path || homedir();
        let { hidden } = req.query;

        let dirs: entityType[] = [];

        let d = await readdir(path.toString(), { withFileTypes: true });
        if (d.length == 0) return res.status(200).send({ dirs, length: dirs.length });

        d.map((e) => {
            if (hidden == 'true')
                dirs.push({ name: e.name, isFile: e.isFile(), path: path != '/' ? path + '/' + e.name : '/' + e.name });
            else
                if (e.name[0] != '.') dirs.push({ name: e.name, isFile: e.isFile(), path: path != '/' ? path + '/' + e.name : '/' + e.name });
        })
        let files: entityType[] = [];

        dirs = dirs.filter((value: entityType) => {
            if (value.isFile === false) {
                return value;
            } else {
                files.push(value);
            }
        });
        dirs = dirs.concat(files);
        res.status(200).send({ dirs, length: dirs.length });
    } catch (error) {
        res.status(500).send(error.message);
    }
}



export const createFolder = async (req: Request, res: Response) => {
    try {
        let path = req.query.path?.toString() || ''
        let state = await stat(path);
        if (state.isFile()) {
            return res.status(500).send('path is file type please enter correct path');
        } else if (state.isDirectory()) {
            await mkdir(path == '/' ? '/' + req.query.folderName : path + '/' + req.query.folderName, { recursive: true });
            return res.status(200).send('folder create with path [' + path + '/' + req.query.folderName + ']');
        } else return res.status(500).send('path not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const createFile = async (req: Request, res: Response) => {
    try {
        if (!req.query.path || !req.body.data || !req.query.fileName) return res.status(404).send('please add path and data to query and body');
        let path = req.query.path.toString();
        let state = await stat(path);
        if (state.isFile()) {
            return res.status(500).send('path is file type please enter correct path');
        } else if (state.isDirectory()) {
            path = path == '/' ? '/' + req.query.fileName?.toString() : path + '/' + req.query.fileName;
            await writeFile(path, req.body.data);
            return res.status(200).send('file create with path [' + path + '/' + req.query.fileName + ']');
        } else return res.status(500).send('path not found');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const deleteEntity = async (req: Request, res: Response) => {
    try {
        let { path } = req.query;
        if (!path) return res.status(404).send('please add file path to query');
        else {
            let state = await stat(path.toString());
            if (state.isDirectory()) {
                await rm(path.toString(), { recursive: true, maxRetries: 3 });
                return res.status(200).send('directory with path [' + path + '] was deleted');
            } else if (state.isFile()) {
                await rm(path.toString());
                return res.status(200).send('file with path [' + path + '] was deleted');
            } else return res.status(500).send('something went wrong this path is not file or folder type');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const readFileData = async (req: Request, res: Response) => {
    try {
        let { path } = req.query;
        if (!path) return res.status(404).send('path not found');
        else {
            let state = await stat(path.toString());
            if (state.isFile()) {
                let data = await readFile(path.toString(), { encoding: 'utf-8' });
                return res.status(200).send({ path: path, data: data });
            } else res.status(500).send('this path is not a file');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const writeDataInFile = async (req: Request, res: Response) => {
    try {
        let { path } = req.query;
        let { data } = req.body;
        console.log(path);
        if (!path || !data) return res.status(404).send('path or data not found');
        else {
            let state = await stat(path.toString());
            if (state.isFile()) {
                await writeFile(path.toString(), data);
                return res.status(200).send('file with path [' + path + '] was updated');
            } else res.status(500).send('this path is not a file');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export const copyEntity = async (req: Request, res: Response) => {
    try {
        let { source, destination } = req.query;
        if (!source || !destination) return res.status(404).send('Please add source and destination');
        await stat(source.toString());
        let pbState = await stat(destination.toString());

        if (!pbState.isDirectory()) return res.status(404).send("destenation expected as directory but got file");

        let fileName = source.toString().split('/')[source.toString().split('/').length - 1];
        await copyFile(source.toString(), destination.toString() + '/' + fileName);
        res.status(200).send('copied ' + source + ' to ' + destination);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const renameFile = async (req: Request, res: Response) => {
    try {
        let { path, newName } = req.query;

        if (!path || !newName) return res.status(404).send('Please enter query details');
        let oldPath = path?.toString();

        let state = await stat(oldPath);

        let pathArr = oldPath.split('/');
        pathArr[pathArr.length - 1] = newName.toString();

        let newPath = pathArr.join('/');
        await rename(oldPath, newPath);
        res.status(200).send('path renamed');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// export const move = async (req: Request, res: Response) => {
//     try {
//         let { source, destination } = req.query;
//         if (!source || !destination) return res.status(404).send('source and destination not found in query');

//         let sourceState = await stat(source.toString());
//         let destState = await stat(destination.toString());

//         if (!destState.isDirectory()) return res.status(404).send('distination is not folder');
//         let fileName = source.toString().split('/')[source.toString().split('/').length - 1];
//         await move(source.toString(), destination.toString() + '/' + fileName);

//         res.status(200).send('copied ' + source + ' to ' + destination);

//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }