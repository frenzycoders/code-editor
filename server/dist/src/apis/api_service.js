"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = exports.copyEntity = exports.readFileData = exports.deleteEntity = exports.createFile = exports.createFolder = exports.read_fileSystem = exports.server_configs = void 0;
const node_os_1 = require("node:os");
const promises_1 = require("node:fs/promises");
const server_configs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        hostname: (0, node_os_1.hostname)(),
        homedir: (0, node_os_1.homedir)(),
        arch: (0, node_os_1.arch)(),
        totalmem: Number(((0, node_os_1.totalmem)() / (1024 * 1024 * 1024)).toFixed(1)),
        freemem: Number(((0, node_os_1.freemem)() / (1024 * 1024 * 1024)).toFixed(1)),
        platform: (0, node_os_1.platform)(),
        release: (0, node_os_1.release)(),
    });
});
exports.server_configs = server_configs;
const read_fileSystem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let path = req.query.path || (0, node_os_1.homedir)();
        let { hidden } = req.query;
        let dirs = [];
        let d = yield (0, promises_1.readdir)(path.toString(), { withFileTypes: true });
        if (d.length == 0)
            return res.status(200).send({ dirs, length: dirs.length });
        d.map((e) => {
            if (hidden == 'true')
                dirs.push({ name: e.name, isFile: e.isFile(), path: path != '/' ? path + '/' + e.name : '/' + e.name });
            else if (e.name[0] != '.')
                dirs.push({ name: e.name, isFile: e.isFile(), path: path != '/' ? path + '/' + e.name : '/' + e.name });
        });
        let files = [];
        dirs = dirs.filter((value) => {
            if (value.isFile === false) {
                return value;
            }
            else {
                files.push(value);
            }
        });
        dirs = dirs.concat(files);
        res.status(200).send({ dirs, length: dirs.length });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.read_fileSystem = read_fileSystem;
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let path = ((_a = req.query.path) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        let state = yield (0, promises_1.stat)(path);
        if (state.isFile()) {
            return res.status(500).send('path is file type please enter correct path');
        }
        else if (state.isDirectory()) {
            yield (0, promises_1.mkdir)(path == '/' ? '/' + req.query.folderName : path + '/' + req.query.folderName, { recursive: true });
            return res.status(200).send('folder create with path [' + path + '/' + req.query.folderName + ']');
        }
        else
            return res.status(500).send('path not found');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.createFolder = createFolder;
const createFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (!req.query.path || !req.body.data || !req.query.fileName)
            return res.status(404).send('please add path and data to query and body');
        let path = req.query.path.toString();
        let state = yield (0, promises_1.stat)(path);
        if (state.isFile()) {
            return res.status(500).send('path is file type please enter correct path');
        }
        else if (state.isDirectory()) {
            path = path == '/' ? '/' + ((_b = req.query.fileName) === null || _b === void 0 ? void 0 : _b.toString()) : path + '/' + req.query.fileName;
            yield (0, promises_1.writeFile)(path, req.body.data);
            return res.status(200).send('file create with path [' + path + '/' + req.query.fileName + ']');
        }
        else
            return res.status(500).send('path not found');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.createFile = createFile;
const deleteEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { path } = req.query;
        if (!path)
            return res.status(404).send('please add file path to query');
        else {
            let state = yield (0, promises_1.stat)(path.toString());
            if (state.isDirectory()) {
                yield (0, promises_1.rm)(path.toString(), { recursive: true, maxRetries: 3 });
                return res.status(200).send('directory with path [' + path + '] was deleted');
            }
            else if (state.isFile()) {
                yield (0, promises_1.rm)(path.toString());
                return res.status(200).send('file with path [' + path + '] was deleted');
            }
            else
                return res.status(500).send('something went wrong this path is not file or folder type');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.deleteEntity = deleteEntity;
const readFileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { path } = req.query;
        if (!path)
            return res.status(404).send('path not found');
        else {
            let state = yield (0, promises_1.stat)(path.toString());
            if (state.isFile()) {
                let data = yield (0, promises_1.readFile)(path.toString(), { encoding: 'utf-8' });
                return res.status(200).send({ path: path, data: data });
            }
            else
                res.status(500).send('this path is not a file');
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.readFileData = readFileData;
const copyEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { source, destination } = req.query;
        if (!source || !destination)
            return res.status(404).send('Please add source and destination');
        yield (0, promises_1.stat)(source.toString());
        let pbState = yield (0, promises_1.stat)(destination.toString());
        if (!pbState.isDirectory())
            return res.status(404).send("destenation expected as directory but got file");
        let fileName = source.toString().split('/')[source.toString().split('/').length - 1];
        yield (0, promises_1.copyFile)(source.toString(), destination.toString() + '/' + fileName);
        res.status(200).send('copied ' + source + ' to ' + destination);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.copyEntity = copyEntity;
const renameFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { path, newName } = req.query;
        if (!path || !newName)
            return res.status(404).send('Please enter query details');
        let oldPath = path === null || path === void 0 ? void 0 : path.toString();
        let state = yield (0, promises_1.stat)(oldPath);
        let pathArr = oldPath.split('/');
        pathArr[pathArr.length - 1] = newName.toString();
        let newPath = pathArr.join('/');
        yield (0, promises_1.rename)(oldPath, newPath);
        res.status(200).send('path renamed');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.renameFile = renameFile;
//# sourceMappingURL=api_service.js.map