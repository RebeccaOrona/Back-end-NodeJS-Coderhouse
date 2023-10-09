import EErrors from "../services/enums.js";

export default (error, req, res, next) => {
    req.logger.info('usando middleware de errores')
    req.logger.warning(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status: 'error', error: error.message});
            break;
        default:
            res.send({status: 'error', error: 'Internal Server Error'});
    }
};