"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = require("express");
const api_service_1 = require("./api_service");
const middlewares_1 = require("./middlewares");
const types_1 = require("./types");
exports.api = (0, express_1.Router)();
exports.api.get('/', api_service_1.server_configs);
exports.api.get('/fs', api_service_1.read_fileSystem);
exports.api.post('/write/:type', (0, middlewares_1.checkValidParams)(types_1.Entity));
exports.api.get('/read-data', api_service_1.readFileData);
//# sourceMappingURL=api_controller.js.map