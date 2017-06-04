import * as express from 'express';
import { projectServices } from './project';

export function init(app: express.Application) {
    projectServices(app);
}
