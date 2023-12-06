import winston from "winston";
import env from "./environment.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'black',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}

const customFormat = winston.format.combine(
    winston.format.colorize({ colors: customLevelsOptions.colors }),
    winston.format.simple()
  );

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: customFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: customFormat,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './errors.log', level: 'error' }),
    ],
});

export const serverLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: customFormat,
    transports: [
        new winston.transports.Console({ level: 'info' }), 
      ],
});

export const addLogger = (req, res, next) => {
    switch(env.environment) {
        case 'development':
            req.logger = devLogger;
            break;
        case 'production':
            req.logger = prodLogger;
            break;
        default:
            req.logger = devLogger;
    }
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleDateString()} in environment ${env.environment}`)
    next();
};
