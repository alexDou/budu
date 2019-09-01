// Type definitions for express-pino-logger 4.0
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.3

import { IncomingMessage, ServerResponse } from 'http';
import { DestinationStream, Level, Logger, LoggerOptions } from 'pino';

export = ExpressPinoLogger;

declare function ExpressPinoLogger(opts?: ExpressPinoLogger.Options, stream?: DestinationStream): ExpressPinoLogger.HttpLogger;
declare function ExpressPinoLogger(stream?: DestinationStream): ExpressPinoLogger.HttpLogger;

declare namespace ExpressPinoLogger {
    type HttpLogger = (req: IncomingMessage, res: ServerResponse) => void;

    interface Options extends LoggerOptions {
        logger?: Logger;
        genReqId?: GenReqId;
        useLevel?: Level;
        stream?: DestinationStream;
        customLogLevel?: (res: ServerResponse, error: Error) => Level;
    }

    interface GenReqId {
        (req: IncomingMessage): number | string | object;
    }
}

declare module 'http' {
    interface IncomingMessage {
        log: Logger;
    }
}
