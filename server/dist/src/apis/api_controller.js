"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = require("express");
const api_service_1 = require("./api_service");
exports.api = (0, express_1.Router)();
exports.api.get('/', api_service_1.server_configs);
exports.api.get('/fs', api_service_1.read_fileSystem);
exports.api.get('/read-data', api_service_1.readFileData);
exports.api.post('/write-data', api_service_1.writeDataInFile);
//# sourceMappingURL=api_controller.js.map