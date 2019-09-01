import pino from 'pino';
import expressPino from 'express-pino-logger';
import { Express } from "express";

export default (express: Express, destination: string) => {
    const pinoOptions = {
        name: "app-logger",
        level: process.env.LOG_LEVEL || 'info',
        prettyPrint: true,
        destination
    };
    // Init logger
    const pinoLogger = pino(pinoOptions);
    const logger = expressPino(pinoLogger);
    // apply middleware
    express.use(logger);

    return logger;
}
