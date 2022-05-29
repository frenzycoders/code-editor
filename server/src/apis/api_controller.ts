import { Router } from 'express';
import { readFileData, read_fileSystem, server_configs } from './api_service';
import { checkValidParams } from './middlewares';
import { Entity } from './types';

export const api = Router();

api.get('/', server_configs);
api.get('/fs', read_fileSystem);
api.post('/write/:type', checkValidParams(Entity))
api.get('/read-data', readFileData);